import type { NextPage } from 'next'
import { getMemos } from './api/memos'
import { IMemo } from '../db/models/memo'
import styles from '../styles/Memo.module.scss'
import React, { useState } from 'react'

interface MemoProps {
  memos: IMemo[],
}

const Memo: NextPage<MemoProps> = ({ memos }) => {
  const [memo, setMemo] = useState<string>('')
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!memo) {
      return
    }
    fetch('http://localhost:3000/api/memos', {
      method: 'POST',
      body: memo,
    })
    .then((res) => {
      setMemo('')
    })
  }
  const handleChangeMemo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMemo(e.target.value)
  }
  return (
    <div id='memo-container'>
      <div>
        <form onSubmit={handleSubmit}>
          <input type='text' placeholder='enter memo' value={memo} onChange={handleChangeMemo}></input>
          <input type='submit' value='click'></input>
        </form>
      </div>
      <div className={styles.memoList}>
        <ul>
          {
            memos?.map((value, _) => {
              return (
                <li key={value.id}> {value.content} </li>
              )
            })
          }
        </ul>
      </div>
    </div>
  )
}

export const getServerSideProps = async () => {
  const memos = await getMemos()
  return {
    props: {
      memos: memos,
    },
  }
}

export default Memo
