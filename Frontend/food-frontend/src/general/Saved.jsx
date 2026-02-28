import React, { useEffect, useRef, useState } from 'react'
import '../styles/reels.css'
import '../styles/saved.css'
import axios from 'axios'

const Saved = () => {
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const containerRef = useRef(null)

    useEffect(() => {
        const fetchSaved = () =>
            axios.get('http://localhost:3000/api/food/save', { withCredentials: true }).then((response) => {
                const savedFoods = (response.data.savedFoods || []).map((item) => ({
                    _id: item.food._id,
                    video: item.food.video,
                    description: item.food.description,
                    likeCount: item.food.likeCount,
                    saveCount: item.food.saveCount,
                    commentsCount: item.food.commentsCount,
                    foodPartner: item.food.foodPartner,
                    saved: true,
                }))
                setVideos(savedFoods)
            })

        fetchSaved().finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const videoNodes = container.querySelectorAll('video')
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const video = entry.target
                    if (entry.isIntersecting) video.play().catch(() => {})
                    else video.pause()
                })
            },
            { threshold: 0.65 }
        )

        videoNodes.forEach((v) => observer.observe(v))
        return () => observer.disconnect()
    }, [videos])

    const removeSaved = async (item) => {
        try {
            await axios.post('http://localhost:3000/api/food/save', { foodId: item._id }, { withCredentials: true })
            const resp = await axios.get('http://localhost:3000/api/food/save', { withCredentials: true })
            const savedFoods = (resp.data.savedFoods || []).map((item) => ({
                _id: item.food._id,
                video: item.food.video,
                description: item.food.description,
                likeCount: item.food.likeCount,
                saveCount: item.food.saveCount,
                commentsCount: item.food.commentsCount,
                foodPartner: item.food.foodPartner,
                saved: true,
            }))

            setVideos(savedFoods)
        } catch (err) {
            // ignore
        }
    }

    if (loading) return <div className="reels-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#fff' }}>Loading saved reels…</div>

    if (!loading && videos.length === 0) return <div className="reels-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#fff' }}>No saved videos</div>

    return (
        <div className="reels-container" ref={containerRef}>
            {videos.map((item) => (
                <section className="reel-item" key={item._id} aria-label={`Reel ${item._id}`}>
                    <video className="reel-video" data-id={item._id} src={item.video} playsInline muted loop preload="metadata" />

                    <div className="reel-gradient" />

                    <div className="reel-overlay modern">
                        <div className="reel-left">
                            <div className="store-badge">{item.foodPartner?.name}</div>
                            <div className="reel-description">{item.description}</div>
                            <div className="reel-meta">Open • 15–25 min • 4.6★</div>
                            {item.foodPartner && (
                                <a
                                    className="reel-button primary"
                                    href={'/food-partner/' + (item.foodPartner._id || item.foodPartner.id || item.foodPartner)}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    Visit {item.foodPartner?.name}
                                </a>
                            )}
                        </div>

                        <div className="reel-right" aria-hidden="false">
                            <button className={"action-btn save" + ((item.saved ?? item.isSaved) ? ' active' : '')} onClick={(e) => { e.stopPropagation(); removeSaved(item) }} aria-label="Save" aria-pressed={item.saved ?? item.isSaved ?? false}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3" aria-hidden="true"><path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z"/></svg>
                                <div className="action-count">{item.saveCount ?? item.save ?? item.saves ?? 0}</div>
                            </button>
                        </div>
                    </div>
                </section>
            ))}
        </div>
    )
}

export default Saved