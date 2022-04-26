import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { cloneDeep } from 'lodash'

import { IMemo } from '../db/models/memo'
import MemoService from '../service/MemoService'

import styles from '../styles/Memo.module.scss'

interface MemoProps {
  memos: IMemo[],
}

const Memo: NextPage<MemoProps> = (props) => {
  const [memos, setMemos] = useState<IMemo[]>([])
  const [newMemo, setNewMemo] = useState<string>('')
  const [checkedMemoIds, setCheckedMemoIds] = useState<Set<number>>(new Set())
  const [updatedMemoId, setUpdatedMemoId] = useState<number>()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!newMemo) {
      return
    }

    fetch('http://localhost:3000/api/memos', {
      method: 'POST',
      body: newMemo,
    })
    .then(async (res) => {
      const result = await res.json()
      if (result.isSuccess) {
        setNewMemo('')
        router.replace(router.asPath)
      } else {
        alert('서버에 문제가 발생했습니다. 저장되지 않았습니다')
      }
    })
  }

  const handleChangeNewMemo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMemo(e.target.value)
  }

  const handleChangeMemoCheckbox = (e: React.ChangeEvent<HTMLInputElement>, memoId: number) => {
    if (!e.target.checked) {
      setCheckedMemoIds(prev => {
        const newCheckedMemoIds = cloneDeep(prev)
        newCheckedMemoIds.delete(memoId)
        return newCheckedMemoIds
      })
    }
    else {
      setCheckedMemoIds(prev => {
        const newCheckedMemoIds = cloneDeep(prev)
        newCheckedMemoIds.add(memoId)
        return newCheckedMemoIds
      })
    }
  }

  const handleClickDeleteMemo = () => {
    const arrayCheckedItems = Array.from(checkedMemoIds)
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
        setCheckedMemoIds(prev => {
          prev.clear()
          return prev
        })
        router.replace(router.asPath)
      } else {
        alert('서버에 문제가 발생했습니다. 삭제되지 않았습니다')
      }
    })
  }

  const handleDoubleClickMemo = (e: React.MouseEvent<HTMLParagraphElement>, memoId: number) => {
    setUpdatedMemoId(memoId)
    if (checkedMemoIds.has(memoId)) {
      setCheckedMemoIds(prev => {
        const newCheckedMemoIds = cloneDeep(prev)
        newCheckedMemoIds.delete(memoId)
        return newCheckedMemoIds
      })
    }
  }

  const handleChangeUpdatedMemo = (e: React.ChangeEvent<HTMLInputElement>, memoId: number) => {
    setMemos(prev => {
      const newMemos = cloneDeep(prev)
      const targetIndex = newMemos.findIndex(memo => memo.id === memoId)
      newMemos[targetIndex].content = e.target.value
      return newMemos
    })
  }

  const handleBlurUpdatedMemo = (memoId: number) => {
    fetch('http://localhost:3000/api/memos', {
      method: 'PUT',
      body: JSON.stringify(memos.find(memo => memo.id === memoId)),
    })
    .then(async (res) => {
      const result = await res.json()
      if (result.isSuccess) {
        setUpdatedMemoId(undefined)
        router.replace(router.asPath)
      } else {
        alert('서버에 문제가 발생했습니다. 삭제되지 않았습니다')
      }
    })
  }

  useEffect(() => {
    setMemos(props.memos)
  }, [props.memos])

  return (
    <div id='memo-container'>
      <div>
        <Link href='/'>
          <button>go to home</button>
        </Link>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <input type='text' placeholder='enter memo' value={newMemo} onChange={handleChangeNewMemo}></input>
          <input type='submit' value='click' autoFocus></input>
        </form>
      </div>
      <div className={styles.memoList}>
        <ul>
          {
            memos?.map((memo, _) => {
              return (
                <li key={memo.id}>
                  {
                    updatedMemoId === memo.id
                    ? (
                      <input
                        type="text"
                        value={memo.content || ''}
                        onChange={e => handleChangeUpdatedMemo(e, memo.id)}
                        onBlur={() => handleBlurUpdatedMemo(memo.id)}
                        autoFocus
                      />
                    )
                    : (
                      <>
                        <input
                          type="checkbox"
                          checked={checkedMemoIds.has(memo.id) || false}
                          onChange={e => handleChangeMemoCheckbox(e, memo.id)}
                        />
                        <p onDoubleClick={e => handleDoubleClickMemo(e, memo.id)}>{memo.content}</p>
                      </>
                    )
                  }
                </li>
              )
            })
          }
        </ul>
      </div>
      <div>
        <button onClick={handleClickDeleteMemo}>delete</button>
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
