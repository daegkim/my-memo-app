import type { NextPage } from 'next'
import { getMemos } from './api/memos'
import { IMemo } from '../db/models/memo'

interface MemoProps {
  memos: IMemo[],
}

const Memo: NextPage<MemoProps> = ({ memos }) => {
  return (
    <div>
      <ul>
        {
          memos.map((value, _) => {
            return (
              <li key={value.id}> {value.content} </li>
            )
          })
        }
      </ul>
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
