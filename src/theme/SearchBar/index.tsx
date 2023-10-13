import React, { useCallback, useRef, useState } from 'react';
import styles from './styles.module.css';
import { Doc, search } from './search';


function SearchBar(): JSX.Element | null {
    const dialog = useRef<HTMLDialogElement | null>(null);
    const [keywords, setKeywords] = useState('');
    const [results, setResults] = useState<Doc[]>([]);

    const handleChange = useCallback(async (value: string) => {
        console.log('handleChange: ' + value);
        if (!value) {
            setResults([]);
            setKeywords('');
        } else if (value !== keywords) {
            setKeywords(value);
            try {
                let res = await search(value);
                console.log(res);
                setResults(res);
            } catch (err) {
                console.error(err);
            }
        }
      }, [dialog]);

    return (
        <>
            <a className='navbar__link' aria-label="Search" onClick={(e)=>dialog.current.showModal()}>
                <svg width="20" height="20" viewBox='0 -4 24 24'>
                    <path d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z" stroke="currentColor" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
                Search
            </a>
            <dialog className={styles.modal} ref={dialog}>
                <form method="dialog">
                    <input className={styles.input} onChange={(e)=>handleChange(e.target.value)} type="text" placeholder="Search.." />
                </form>
                {results && results.length > 0 &&
                    results.map((doc)=>{
                        return (
                    <div className={styles.result} key={doc.url}>
                        <a href={doc.url}>
                            <h4 className={styles.title}>{doc.title}</h4>
                            <h6 className={styles.url}>{doc.url}</h6>
                            <p className={styles.match}>
                            { doc.chunks && doc.chunks.length > 0 && doc.chunks.map((ch, idx) => {
                                    if (ch.bold) {
                                        return (<b key={idx}>{ch.value} </b>);
                                    } else {
                                        return (<span key={idx}>{ch.value} </span>);
                                    }
                                }
                                )
                            }
                            </p>
                        </a>
                        </div>
                       )})}
            </dialog>
        </>
    );
}

export default React.memo(SearchBar);