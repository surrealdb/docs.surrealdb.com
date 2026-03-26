#!/usr/bin/env bash
set -euo pipefail

QUALITY="${QUALITY:-90}"
ROOT_DIR="${1:-src/assets/img}"
MIN_SIZE_KB="${MIN_SIZE_KB:-5}"
MIN_SIZE_BYTES=$((MIN_SIZE_KB * 1000))
SMALL_FILE_QUALITY="${SMALL_FILE_QUALITY:-85}"
QUALITY_STEP="${QUALITY_STEP:-1}"
MIN_QUALITY="${MIN_QUALITY:-85}"
YUV_FORMAT="${YUV_FORMAT:-444}"

total_before=0
total_after=0
converted_count=0
failed_count=0
updated_ref_files=0
retry_count=0
small_quality_count=0

# Colors (only when output is a terminal)
if [[ -t 1 ]]; then
  GREEN=$'\033[32m'
  RED=$'\033[31m'
  RESET=$'\033[0m'
else
  GREEN=""
  RED=""
  RESET=""
fi

bytes_to_mb() {
  local bytes="$1"
  awk -v b="$bytes" 'BEGIN { printf "%.2fMB", b / 1000000 }'
}

clamp_quality() {
  local q="$1"
  if (( q < 0 )); then
    echo 0
  elif (( q > 100 )); then
    echo 100
  else
    echo "$q"
  fi
}

encode_avif() {
  local input="$1"
  local output="$2"
  local q="$3"
  avifenc --qcolor "$q" --qalpha "$q" --yuv "$YUV_FORMAT" "$input" "$output" >/dev/null 2>&1
}

while IFS= read -r -d '' file; do
  out="${file%.*}.avif"

  before_bytes=$(stat -f%z "$file")

  current_quality="$QUALITY"
  used_small_quality=0
  retry_note=""
  if (( before_bytes < MIN_SIZE_BYTES )); then
    current_quality="$SMALL_FILE_QUALITY"
    used_small_quality=1
    small_quality_count=$((small_quality_count + 1))
    retry_note=" | q=${SMALL_FILE_QUALITY} (< ${MIN_SIZE_KB}KB)"
  fi
  current_quality="$(clamp_quality "$current_quality")"

  if encode_avif "$file" "$out" "$current_quality"; then
    after_bytes=$(stat -f%z "$out")

    # If the converted image is bigger, retry with lower quality.
    if (( used_small_quality == 0 )) && (( after_bytes > before_bytes )); then
      while (( current_quality - QUALITY_STEP >= MIN_QUALITY )) && (( after_bytes > before_bytes )); do
        current_quality=$((current_quality - QUALITY_STEP))
        if encode_avif "$file" "$out" "$current_quality"; then
          after_bytes=$(stat -f%z "$out")
          retry_count=$((retry_count + 1))
        else
          break
        fi
      done

      if (( current_quality != QUALITY )); then
        retry_note=" | retried q=${QUALITY}->${current_quality}"
      fi
    fi

    diff_bytes=$((before_bytes - after_bytes))
    # positive % = reduction, negative % = bigger file
    pct=$(awk -v b="$before_bytes" -v d="$diff_bytes" 'BEGIN { printf "%.2f", (d / b) * 100 }')

    # Display in MB
    before_h=$(bytes_to_mb "$before_bytes")
    after_h=$(bytes_to_mb "$after_bytes")
    diff_abs=$(( diff_bytes < 0 ? -diff_bytes : diff_bytes ))
    diff_h=$(bytes_to_mb "$diff_abs")

    if (( diff_bytes >= 0 )); then
      echo "${GREEN}OK   $file -> $out | $before_h -> $after_h | saved $diff_h (${pct}%)${retry_note}${RESET}"
    else
      echo "${RED}OK   $file -> $out | $before_h -> $after_h | increased $diff_h (${pct}%)${retry_note}${RESET}"
    fi

    # Delete original only after successful conversion
    rm "$file"

    total_before=$((total_before + before_bytes))
    total_after=$((total_after + after_bytes))
    converted_count=$((converted_count + 1))
  else
    echo "FAIL $file (kept original)" >&2
    failed_count=$((failed_count + 1))
  fi
done < <(find "$ROOT_DIR" -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.webp" \) -print0)

# Print final summary
total_diff=$((total_before - total_after))
total_pct=$(awk -v b="$total_before" -v d="$total_diff" 'BEGIN { if (b==0) printf "0.00"; else printf "%.2f", (d / b) * 100 }')

tb_h=$(bytes_to_mb "$total_before")
ta_h=$(bytes_to_mb "$total_after")
td_abs=$(( total_diff < 0 ? -total_diff : total_diff ))
td_h=$(bytes_to_mb "$td_abs")

echo
echo "---- Summary ----"
echo "Converted: $converted_count"
echo "Failed:    $failed_count"
echo "Small q=${SMALL_FILE_QUALITY}: $small_quality_count (< ${MIN_SIZE_KB}KB)"
echo "Retries:   $retry_count"
echo "Refs:      $updated_ref_files file updates"
echo "Before:    $tb_h"
echo "After:     $ta_h"
if (( total_diff >= 0 )); then
  echo "Saved:     $td_h (${total_pct}%)"
else
  echo "Increased: $td_h (${total_pct}%)"
fi

bash ./scripts/fix-img-import.sh