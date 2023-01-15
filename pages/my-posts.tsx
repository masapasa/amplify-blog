import React, { useEffect, useState } from 'react'
import { API, graphqlOperation, Auth } from "aws-amplify";
import moment from "moment";
import Link from 'next/link';
import Head from 'next/head';

import { PostsByUsernameQuery } from './api/API';
import { postsByUsername } from '@/src/graphql/queries';
import NavBar from './components/navbar';

const MyPosts = () => {
    const [posts, setPosts] = useState<PostsByUsernameQuery>();

    const fetchPosts = async () => {
        const { username } = await Auth.currentAuthenticatedUser();
        const postsData = (await API.graphql(graphqlOperation(postsByUsername, { username }))) as {
            data: PostsByUsernameQuery
        }
        setPosts(postsData.data);
    }

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <>
            <Head>
                <title>Amplify Blog | Home</title>
                <meta name="description" content="This is a blog developed with Next and Amplify" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className='min-h-screen w-full bg-neutral-900'>
                <NavBar />
                <div className='max-w-xl w-full mx-auto pt-28'>
                    <div className='text-4xl font-bold text-white'>My Posts</div>
                    <div className='min-h-full w-full'>
                        {posts ? (
                            <div className='flex justify-center items-center min-h-full mt-10 flex-col'>
                                {posts.postsByUsername?.items.map((post, index) => (
                                    <Link key={index} href={`/posts/${post?.id}`} className='bg-neutral-800 w-full rounded-lg px-5 py-3 mb-7'>
                                        <div className='flex space-x-3 items-center'>
                                        <div className='text-white text-lg font-medium'>{post?.title}</div>
                                        <div className='text-gray-400 text-sm font-light'>by {post?.username} {moment(post?.updatedAt).fromNow()}</div>
                                        </div>
                                        <div className='text-white text-lg'>{post?.content}</div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className='flex justify-center items-center min-h-full mt-44'>
                                <div className='text-2xl text-white'>You don&apos;t have any posts!</div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    )
}

export default MyPosts;