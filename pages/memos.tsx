import React, { useState } from 'react'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { IMemo } from '../db/models/memo'
import MemoService from '../service/MemoService'

import styles from '../styles/Memo.module.scss'

interface MemoProps {
  memos: IMemo[],
}

const Memo: NextPage<MemoProps> = ({ memos }) => {
  const [memo, setMemo] = useState<string>('')
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set())
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!memo) {
      return
    }

    fetch('http://localhost:3000/api/memos', {
      method: 'POST',
      body: memo,
    })
    .then(async (res) => {
      const result = await res.json()
      if (result.isSuccess) {
        setMemo('')
        router.replace(router.asPath)
      } else {
        alert('서버에 문제가 발생했습니다. 저장되지 않았습니다')
      }
    })
  }

  const handleChangeMemo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMemo(e.target.value)
  }

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    if (!e.target.checked) {
      setCheckedItems(prev => {
        prev.delete(id)
        return prev
      })
    }
    else {
      setCheckedItems(prev => prev.add(id))
    }
  }

  const handleDelete = () => {
    const arrayCheckedItems = Array.from(checkedItems)
    if (!arrayCheckedItems || arrayCheckedItems.length === 0) {
      alert('삭제할 것이 없습니다.')
    }

    fetch('http://localhost:3000/api/memos', {
      method: 'DELETE',
      body: JSON.stringify(arrayCheckedItems),
    })
    .then(async (res) => {
      const result = await res.json()
      if (result.isSuccess) {
        setCheckedItems(prev => {
          prev.clear()
          return prev
        })
        router.replace(router.asPath)
      } else {
        alert('서버에 문제가 발생했습니다. 삭제되지 않았습니다')
      }
    })
  }

  return (
    <div id='memo-container'>
      <div>
        <Link href='/'>
          <button>go to home</button>
        </Link>
      </div>
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
                <li key={value.id}>
                  <input type="checkbox" onChange={e => handleCheckbox(e, value.id)}></input>
                  <p>{value.content}</p>
                </li>
              )
            })
          }
        </ul>
      </div>
      <div>
        <button onClick={handleDelete}>delete</button>
      </div>
    </div>
  )
}

export const getServerSideProps = async () => {
  const memoService = new MemoService()
  const result = await memoService.getMemos()
  // result.isSuccess가 false인 경우는 잠시 빼둠
  return {
    props: {
      memos: result.data,
    },
  }
}

export default Memo
