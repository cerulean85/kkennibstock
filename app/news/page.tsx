'use client'
import { NewsService } from '@/services/NewsService';
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';

const News = () => {

  const [mediaList, setMediaList] = useState<[]>([]);
  const fetchMediaList = async () => {
    const serv = new NewsService();
    const result = await serv.getRssMediaList()
    setMediaList(result);
  }

  const [feedList, setFeedList] = useState<[]>([]);
  const fetchFeedList = async (mediaName: string) => {
    const serv = new NewsService();
    const result = await serv.getRssFeedList(mediaName);
    setFeedList(result);
  }

  useEffect(() => {
    fetchMediaList();
  }, [])

  const formatDate = (dateStr: string) => {
    return dayjs(dateStr).format('YYYY-MM-DD');
    
  }

  return (
    <div className='pb-3'>
      <div className='flex p-2'>
      {
        mediaList &&
        mediaList.map((v: any, i: number) => (
          <button 
            key={i}
            className="btn btn-primary me-2"
            onClick={() => { fetchFeedList(v.idx) }}>{v.name}</button>
        ))
      }
      </div>

      <div className='p-2 overflow-y-auto'>
        {
          feedList &&
          feedList.map((v: any, i: number) => (
            <div key={i} className="p-3 mb-3 bg-gray-200">
              <div className="flex">
                <a className="font-bold"
                   href={v.link} 
                   target="_blank">
                  {v.title}
                </a>
                <div className="ms-2">{formatDate(v.updatedAt)}</div>
              </div>
              
            </div>
          ))
        }
                {
          feedList &&
          feedList.map((v: any, i: number) => (
            <div key={i} className="p-3 mb-3 bg-gray-200">
              <div className="flex">
                <a className="font-bold"
                   href={v.link} 
                   target="_blank">
                  {v.title}
                </a>
                <div className="ms-2">{formatDate(v.updatedAt)}</div>
              </div>
              
            </div>
          ))
        }
      </div>
    </div>

    
  );
};

export default News;