import { useState, useEffect } from 'react';
import Head from 'next/head'
import { API, graphqlOperation } from 'aws-amplify'

import { listTodos } from 'src/graphql/queries';
import { ListTodosQuery } from 'pages/api/API';

export default function Home() {
  const [posts, setPosts] = useState<ListTodosQuery>();

  const fetchPosts = async () => {
    const postsData = (await API.graphql(graphqlOperation(listTodos))) as {
      data: ListTodosQuery
    }
    setPosts(postsData.data);
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='h-screen w-full bg-red-500 flex justify-center items-center flex-col'>
        <div className='text-2xl text-white'>Hello World!</div>
        {posts ? (
          posts.listTodos?.items.map((post, index) => (
            <div key={index}>{post?.title}</div>
          ))
        ) : (
          <div className='text-2xl text-white'>There is no posts registered!</div>
        )}
      </main>
    </>
  )
}
