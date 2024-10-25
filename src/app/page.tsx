'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link';
import { fetchData } from '@/app/fetchData'
import clsx from 'clsx'
import { BsArrowLeftSquareFill as ArrowLeftIcon, BsArrowRightSquareFill as ArrowRightIcon } from 'react-icons/bs';
import { usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const POSTSPERPAGE = 6;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const avatars = ['/amy-burns.png', '/avatar1.jpg', '/avatar2.jpg', '/balazs-orban.png',
    '/delba-de-oliveira.png', '/evil-rabbit.png', '/lee-robinson.png', '/michael-novotny.png', '/avatar3.jpg', '/avatar4.jpg']
  const [posts, setPosts] = useState([]);
  const currentPage = Number(searchParams.get('page') ? Number(searchParams.get('page')) : 1)
  const [inicio, setInicio] = useState(0)
  const [fin, setFin] = useState(POSTSPERPAGE)
  const [pagination, setPagination] = useState([])

  useEffect(() => {
    fetchData()
      .then((res) =>
        setPosts(res)
      )
  }, [])

  const totalPages = Math.ceil(posts.length / POSTSPERPAGE)

  useEffect(() => {
    if (currentPage < 3 || currentPage > (totalPages - 2)) {
      setPagination([1, 2, 3, '...', totalPages - 2, totalPages - 1, totalPages])
    }
    else {
      setPagination([1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages])
    }
  }, [currentPage, totalPages])

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  }

  useEffect(() => {
    setInicio((currentPage - 1) * POSTSPERPAGE);
    setFin(inicio + POSTSPERPAGE);
  }, [currentPage, inicio])

  return (
    <div className="bg-gray-900 flex flex-col items-center min-h-screen py-10 px-4 text-gray-300">
      <main className="w-full max-w-3xl space-y-6">
        <h1 className="text-3xl font-semibold text-indigo-400 text-center">Posts</h1>
        <ul className="space-y-6">
          {
            posts.slice(inicio, fin).map((post) => (
              <li key={post.id} className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4"></div>
                <Image
                  className="rounded-full"
                  src={avatars[post.userId - 1]}
                  alt={`avatar of ${post.userId}`}
                  width={40}
                  height={40}
                />
                <div className="text-lg font-semibold text-gray-800">User: {post.userId}</div>
                <div className="mt-4 text-gray-500 text-sm">Post number: {post.id}</div>
                <h2 className="mt-2 text-xl font-bold text-indigo-500">{post.title}</h2>
                <p className="mt-1 text-gray-300">Content: {post.body}</p>
              </li>
            ))}
        </ul>
        <div className="flex items-center justify-center mt-8 space-x-2">
          <Link
            href={(currentPage === 1) ? createPageURL(currentPage) : createPageURL(currentPage - 1)}
            className={clsx("px-4 py-2 rounded-md border border-gray-700 flex items-center gap-2 transition hover:bg-gray-700 text-gray-300",
              { 'pointer-events-none opacity-50': currentPage === 1 }
            )}
          >
            <ArrowLeftIcon className="h-4 w-4" />
            PREV
          </Link>
          {pagination.map((page, index) => {
            return (
              <div>
                <Pagination_numbers
                  key={page}
                  href={createPageURL(page)}
                  page={page}
                  currentPage={currentPage}
                />
              </div>
            )
          })
          }
          <Link
            href={(currentPage === totalPages) ? createPageURL(currentPage) : createPageURL(currentPage + 1)}
            className={clsx("px-4 py-2 rounded-md border border-gray-700 flex items-center gap-2 transition hover:bg-gray-700 text-gray-300",
              { 'pointer-events-none opacity-50': currentPage === totalPages }
            )}>NEXT
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </main >
    </div >
  )

  function Pagination_numbers({
    href,
    page,
    currentPage
  }: {
    href: string,
    page: number | string,
    currentPage: number | string
  }) {
    return (
      <Link
        href={href}
        className={clsx(
          "flex h-10 w-10 items-center justify-center rounded-md border transition",
          {
            "bg-indigo-500 text-white border-indigo-500": currentPage === page,
            "bg-gray-700 text-gray-300 hover:bg-gray-600": currentPage !== page,
            "pointer-events-none opacity-50": page === '...'
          }
        )}
      >
        {page}
      </Link>
    )
  }
}





