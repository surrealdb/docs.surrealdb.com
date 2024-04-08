import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './styles.module.css';
import { Doc, search } from './search';

function SearchBar(): JSX.Element | null {
    const dialogRef = useRef<HTMLDialogElement>();
    const [keywords, setKeywords] = useState('');
    const [results, setResults] = useState<Doc[]>([]);
    const iterRef = useRef<number>(0);

    function debounce<F extends (...args: any[]) => void>(func: F, delay: number): (...args: Parameters<F>) => void {
        let inDebounce: NodeJS.Timeout | undefined;
      
        return function(...args: Parameters<F>) {
            const context = this;
            if (inDebounce) {
                clearTimeout(inDebounce);
            }
            inDebounce = setTimeout(() => func.apply(context, args), delay);
        };
    }

    const debouncedSearch = useCallback(debounce(async (value: string) => {
        const iter = iterRef.current = iterRef.current + 1;
        if (!value) {
            setResults([]);
        } else if (value !== keywords) {
            try {
                const res = await search(value);
                if (iter == iterRef.current) setResults(res);
            } catch (err) {
                console.error(err);
            }
        }
    }, 150), [keywords]);

    const openDialog = useCallback(() => {
        dialogRef.current.showModal();
    }, [dialogRef]);
    
    const handleChange = (value: string) => {
        setKeywords(value);
        debouncedSearch(value);
    };

    useEffect(() => {
        const handler = (e) => {
            if (dialogRef.current && !dialogRef.current.contains(e.target)) {
                dialogRef.current.close();
            }
        };

        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [dialogRef]);

    useEffect(() => {
        const isSearchHotkey = (event: KeyboardEvent) => (event.metaKey || event.ctrlKey) && event.key === 'k';

        const handleKeyDown = (event: KeyboardEvent) => {
            if (isSearchHotkey(event)) {
                event.preventDefault();
                openDialog();
            }
        };
    
        window.addEventListener('keydown', handleKeyDown);
    
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
      }, [openDialog]);

    const isMacOs = typeof window != "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
    const searchHotKeyIndicator = isMacOs ? '⌘ K' : 'Ctrl K';

    return (
        <>
            <a className={styles.link + ' navbar__link'} aria-label="Search" onClick={openDialog}>
                <svg className={styles.linkicon} width="20" height="20" viewBox='0 -4 24 24'>
                    <path d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z" stroke="currentColor" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
                Search
                {searchHotKeyIndicator && (
                    <span className={styles.hotkey}>{searchHotKeyIndicator}</span>
                )}
            </a>
            <dialog className={styles.modal} ref={dialogRef}>
                <form method="dialog">
                    <input className={styles.input} onChange={(e)=>handleChange(e.target.value)} type="text" placeholder="Search.." value={keywords} />
                </form>
                {(results && results.length > 0) ? (
                    <ol className={styles.results}>
                        {results.map((doc)=>(
                           <li key={doc.url} className={styles.result}>
                                <a href={doc.url}>
                                    <h4 className={styles.title}>{doc.title}</h4>
                                    <h6 className={styles.url}>{doc.url}</h6>
                                    <p className={styles.match}>
                                        {doc.chunks && doc.chunks.length > 0 && doc.chunks.map((ch, idx) => {
                                            if (ch.bold) {
                                                return (<b key={idx}>{ch.value} </b>);
                                            }
                                            return (<span key={idx}>{ch.value} </span>);
                                        })}
                                    </p>
                                </a>
                           </li>
                        ))}
                    </ol>
                ) : (
                    <div className={styles.empty}>
                        <p>{keywords == '' ? 'Enter a search term' : 'No results'}</p>
                    </div>
                )}
            </dialog>
        </>
    );
}

export default React.memo(SearchBar);