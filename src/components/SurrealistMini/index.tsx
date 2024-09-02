type MiniProps = {
    dataset?: 'surreal-deal';
    setup?: string;
    query?: string;
    variables?: string | Record<string, unknown>;
    theme?: 'automatic' | 'light' | 'dark';
}

export function SurrealistMini({
    url: _url,
    height,
    ...props
}: MiniProps & {
    url?: string;
    height?: string;
}) {
    props.variables = typeof props.variables == 'string' ? props.variables : JSON.stringify(props.variables);
    const stringified = Object.fromEntries(Object.entries(props).map(([k,v]) => [k, (v ?? '').toString()]));
    const search = new URLSearchParams(stringified).toString();
    const url = (_url ?? `https://surrealist.app/mini?${search}`) + '&compact';
    return (
        <iframe src={url} style={{width: '100%', height: height ?? '600px', border: 'none', borderRadius: '10px' }} />
    )
}