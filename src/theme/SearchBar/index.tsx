import React, { useCallback, useRef, useState } from 'react';
import styles from './styles.module.css';


function SearchBar(): JSX.Element | null {
    const dialog = useRef<HTMLDialogElement | null>(null);
    const [keywords, setKeywords] = useState('');

    const handleChange = useCallback((value: string) => {
        if (value !== keywords) {
            console.log(value);
            setKeywords(value);
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
            <dialog className={styles.searchmodal} ref={dialog}>
                <form method="dialog">
                    <input className={styles.searchinput} onChange={(e)=>handleChange(e.target.value)} type="text" placeholder="Search.." value={keywords} />
                </form>
            </dialog>
        </>
    );
}

export default React.memo(SearchBar);