import classNames from 'classnames'
import { useStore } from 'common/store'
import { observer } from 'utils/mobx'
import { PostModel } from 'models/post'
import Router from 'next/router'
import React, { FC } from 'react'
import removeMd from 'remove-markdown'
import { parseDate } from 'utils/time'
import styles from './index.module.scss'

interface Props {
  date: Date | string
  title: string
  text: string
  slug: string
  raw: PostModel
  map?: Map<string, string>
}

export const PostBlock: FC<Props> = observer((props) => {
  const {
    appStore: { viewport },
    categoryStore: { CategoryMap },
  } = useStore()
  const { date, title, text, slug, raw } = props
  const parsedTime = viewport?.mobile
    ? parseDate(date, 'MM-DD ddd')
    : parseDate(date, 'YYYY-MM-DD ddd')
  const [d, week] = parsedTime.split(' ')

  const goToPost = () => {
    const categorySlug = raw.category?.slug ?? CategoryMap.get(raw.categoryId)
    Router.push('/posts/[category]/[slug]', `/posts/${categorySlug}/${slug}`)
    window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
  }
  const hasImage = props.raw.images?.length > 0 && props.raw.images[0].src
  return (
    <>
      <h1 className={styles.head}>
        {d}
        <small>（{week}）</small>
        {!viewport?.mobile && (
          <div className={styles.title} onClick={goToPost}>
            {title}
          </div>
        )}
      </h1>
      <div className={classNames('note-item', styles.text)}>
        {viewport?.mobile && (
          <h2 className={styles.title} onClick={goToPost}>
            {title}
          </h2>
        )}
        <article
          className={classNames(
            'note-content',
            hasImage ? styles['has-image'] : null,
          )}
        >
          {hasImage && (
            <div
              className={styles['post-image-preview']}
              style={{ backgroundImage: `url(${hasImage})` }}
            />
          )}
          <div>{removeMd(text).slice(0, 250) + '..'}</div>
          <div className=""></div>
        </article>
        <section className={styles.navigator}>
          <button className={styles.btn} onClick={goToPost}>
            查看原文
          </button>
        </section>
      </div>
    </>
  )
})
