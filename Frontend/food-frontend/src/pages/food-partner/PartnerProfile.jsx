import React, { useState, useEffect, useRef } from 'react'
import '../../styles/profile.css'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const PartnerProfile = () => {
    const { id } = useParams()
    const [ profile, setProfile ] = useState(null)
    const [ videos, setVideos ] = useState([])

    useEffect(() => {
        // don't call API without a valid id (avoid requests to '/:id')
        if (!id || String(id).includes(':')) return
        axios.get(`http://localhost:3000/api/food-partner/${encodeURIComponent(id)}`, { withCredentials: true })
            .then(response => {
            
                setProfile(response.data.foodPartner)
                setVideos(response.data.foodPartner.foodItems)
            })
            .catch(err => {
                console.error('Failed loading partner:', err)
                setProfile(null)
                setVideos([])    
            })
    }, [ id ])
useEffect(() => {
  if (!id) return;

  axios
    .get(`http://localhost:3000/api/food-partner/${id}/stats`)
    .then(res => {
      setProfile(p => ({
        ...(p || {}),
        totalMeals: res.data.totalMeals,
        customersServed: res.data.customersServed
      }));
    })
    .catch(err => console.error("Stats error", err));
}, [id]);



    // Modal state for in-app fullscreen player
    const [ activeVideo, setActiveVideo ] = useState(null)
    const modalVidRef = useRef(null)

    const openModalPlayer = (videoUrl) => {
        // pause any grid videos
        document.querySelectorAll('.profile-grid-video').forEach(v => {
            try { v.pause() } catch (e) {}
        })
        setActiveVideo(videoUrl)
        // lock scroll
        document.body.style.overflow = 'hidden'
    }

    const closeModalPlayer = () => {
        try { modalVidRef.current?.pause() } catch (e) {}
        setActiveVideo(null)
        document.body.style.overflow = ''
    }

    useEffect(() => {
        if (!activeVideo) return
        const vid = modalVidRef.current
        if (!vid) return
        const p = vid.play()
        if (p && p.catch) p.catch(() => {})

        // on Escape key close modal
        const onKey = (e) => { if (e.key === 'Escape') closeModalPlayer() }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [ activeVideo ])


    return (
        <main className="profile-page">
            <section className="profile-header">
                <div className="profile-meta">

                    <img className="profile-avatar" src="https://images.unsplash.com/photo-1754653099086-3bddb9346d37?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0Nnx8fGVufDB8fHx8fA%3D%3D" alt="" />

                    <div className="profile-info">
                        <h1 className="profile-pill profile-business" title="Business name">
                            {profile?.name}
                        </h1>
                        <p className="profile-pill profile-address" title="Address">
                            {profile?.address}
                        </p>
                    </div>
                </div>

                <div className="profile-stats" role="list" aria-label="Stats">
                    <div className="profile-stat" role="listitem">
                        <span className="profile-stat-label">total meals</span>
                        <span className="profile-stat-value">{profile?.totalMeals}</span>
                    </div>
                    <div className="profile-stat" role="listitem">
                        <span className="profile-stat-label">customer served</span>
                        <span className="profile-stat-value">{profile?.customersServed || 0}</span>
                    </div>
                </div>
            </section>

            <hr className="profile-sep" />

            <section className="profile-grid" aria-label="Videos">
                {videos.map((v, i) => (
                    <div key={v._id ?? v.id ?? v.video ?? i} className="profile-grid-item">
             
                        {/* Placeholder tile; replace with <video> or <img> as needed
                           {videos.map((v) => (
                    <div key={v.id} className="profile-grid-item">
                        
                         */}


                        <video
                            className="profile-grid-video"
                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                            src={v.video}
                            muted
                            playsInline
                            onClick={() => openModalPlayer(v.video)}
                        />


                    </div>
                    
                ))}
            </section>
            {activeVideo && (
                <div className="video-modal" role="dialog" aria-modal="true" onClick={(e) => { if (e.target === e.currentTarget) closeModalPlayer() }}>
                    <button className="video-modal-close" onClick={closeModalPlayer}>Back</button>
                    
                    <div className="video-modal-content">
                        <video
                            ref={modalVidRef}
                            src={activeVideo}
                            controls
                            playsInline
                        />
                    </div>
                    
                </div>
            )}
        </main>
    )
}

export default PartnerProfile
