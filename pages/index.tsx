import type { NextPage } from 'next'
import Link from 'next/link'

const Home: NextPage = () => {
  return (
    <div>
      <div>
        home
      </div>
      <div>
        <Link href="/memos">
          <button>go to memo</button>
        </Link>
      </div>
    </div>
  )
}

export default Home
