/*
 * @Author: Innei
 * @Date: 2020-05-29 21:54:33
 * @LastEditTime: 2020-09-02 13:40:39
 * @LastEditors: Innei
 * @FilePath: /mx-web/common/socket/handler.ts
 * @Code with Love
 */

import { createDangmaku } from '../../utils/danmaku'
import { Notice } from '../../utils/notice'
import { appStore, gatewayStore, userStore } from '../store'
import { EventTypes } from './types'
// import Router from 'next/router'

export const notice = new Notice()

export const eventHandler = (type: EventTypes, data: any) => {
  const title = appStore.seo.title
  switch (type) {
    case EventTypes.VISITOR_ONLINE:
    case EventTypes.VISITOR_OFFLINE: {
      const { online } = data
      gatewayStore.online = online
      break
    }
    case EventTypes.POST_CREATE:
    case EventTypes.NOTE_CREATE: {
      if (data.hide) {
        break
      }
      const message = noticeHead('文章', data.title)
      const _type: Record<
        EventTypes.POST_CREATE | EventTypes.NOTE_CREATE,
        string
      > = {
        [EventTypes.POST_CREATE]: 'post',
        [EventTypes.NOTE_CREATE]: 'note',
      }
      notice.notice({
        title: title,
        body: message,
        description: getDescription(data.text),
        onclick: () => {
          window.open(
            _type[type] === 'post'
              ? '/posts/' + data.category.slug + '/' + data.slug
              : '/notes/' + data.nid,
          )
          // Router.push(
          //   _type[type] === 'post' ? '/posts/[category]/[slug]' : '/notes/[id]',
          //   _type[type] === 'post'
          //     ? '/posts/' + data.category.slug + '/' + data.slug
          //     : '/notes/' + data.nid,
          // )
        },
      })

      break
    }
    case EventTypes.SAY_CREATE: {
      const message = noticeHead('说说')
      notice.notice({
        title: title,
        body: message,
        description: getDescription(data.text),
        onclick: () => {
          window.open('/says')
        },
      })

      break
    }
    case EventTypes.DANMAKU_CREATE: {
      createDangmaku({
        text: data.author + ': ' + data.text,
        color: data.color,
      })

      if (
        data.author === userStore.name ||
        data.author === userStore.username
      ) {
        notice.notice({
          title: userStore.name + ' 敲了你一下',
          body: data.text,
          options: { image: userStore.master.avatar },
        })
      }
    }
  }
}
function noticeHead(type: string, title?: string) {
  return `${userStore.name}发布了新的${type}${title ? ': ' + title : ''}`
}
function getDescription(text: string) {
  return text.slice(0, 20) + '...'
}
