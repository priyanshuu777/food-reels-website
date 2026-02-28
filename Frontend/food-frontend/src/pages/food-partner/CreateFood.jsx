import React, { useRef, useState, useEffect } from 'react'
import './createfood.css' 
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const CreateFood = () => {
  const [videoFile, setVideoFile] = useState(null)
  const [videoURL, setVideoURL] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const fileInputRef = useRef(null)
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
const [isFullscreen, setIsFullscreen] = useState(false)
  const [videoAspect, setVideoAspect] = useState(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [isScrubbing, setIsScrubbing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const navigate = useNavigate()

  const handleVideoChange = (e) => {
    const file = e.target.files && e.target.files[0]
    if (file && file.type.startsWith('video/')) {
      // revoke previous object URL to avoid memory leaks
      if (videoURL) URL.revokeObjectURL(videoURL)
      setVideoFile(file)
      setVideoURL(URL.createObjectURL(file))
      setIsPlaying(false)
      setDuration(0)
      setVideoAspect(null)
    } else {
      setVideoFile(null)
      if (videoURL) URL.revokeObjectURL(videoURL)
      setVideoURL('')
      setIsPlaying(false)
      setDuration(0)
      setVideoAspect(null)
    }
  }

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return
    setDuration(Math.floor(videoRef.current.duration || 0))
    const w = videoRef.current.videoWidth || 16
    const h = videoRef.current.videoHeight || 9
    // set aspect like "1920 / 1080" to be used as CSS aspect-ratio
    setVideoAspect(`${w} / ${h}`)
  }

  const handleTogglePlay = (e) => {
    if (e && e.stopPropagation) e.stopPropagation()
    const vid = videoRef.current
    if (!vid) return
    if (vid.paused) {
      vid.play()
      setIsPlaying(true)
    } else {
      vid.pause()
      setIsPlaying(false)
    }
  }

  const formatDuration = (s) => {
    if (!s) return ''
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2,'0')}`
  }

  useEffect(() => {
    const onFullChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFullChange)
    return () => document.removeEventListener('fullscreenchange', onFullChange)
  }, [])

  useEffect(() => {
    const vid = videoRef.current
    if (!vid) { setCurrentTime(0); return }
    const onTime = () => setCurrentTime(vid.currentTime || 0)
    const onEnded = () => setIsPlaying(false)
    vid.addEventListener('timeupdate', onTime)
    vid.addEventListener('ended', onEnded)
    return () => {
      vid.removeEventListener('timeupdate', onTime)
      vid.removeEventListener('ended', onEnded)
    }
  }, [videoURL])

  const handleToggleFullScreen = async (e) => { 
    if (e && e.stopPropagation) e.stopPropagation()
    const el = videoRef.current ? videoRef.current.closest('.video-container') || videoRef.current : null
    if (!el) return
    try {
      if (!document.fullscreenElement) {
        if (el.requestFullscreen) await el.requestFullscreen()
        else if (videoRef.current && videoRef.current.webkitEnterFullscreen) videoRef.current.webkitEnterFullscreen()
        setIsFullscreen(true)
      } else {
        if (document.exitFullscreen) await document.exitFullscreen()
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen()
        setIsFullscreen(false)
      }
    } catch (err) {
      console.warn('Fullscreen failed:', err)
    }
  }

  const seekFromClientX = (el, clientX) => {
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = clientX - rect.left
    const ratio = Math.max(0, Math.min(1, x / rect.width))
    if (videoRef.current && duration) {
      videoRef.current.currentTime = ratio * duration
      // update currentTime immediately for snappy UI
      setCurrentTime(ratio * duration)
    }
  }

  const handleSeek = (e) => seekFromClientX(e.currentTarget, e.clientX)
  const handleTouchSeek = (e) => {
    if (!e.touches || !e.touches[0]) return
    seekFromClientX(e.currentTarget, e.touches[0].clientX)
  }

  const handleRemoveVideo = async () => { 
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
    // exit fullscreen if active
    try {
      if (document.fullscreenElement) {
        if (document.exitFullscreen) await document.exitFullscreen()
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen()
      }
    } catch (err) { /* ignore */ }
    // revoke object URL
    if (videoURL) URL.revokeObjectURL(videoURL)
    setVideoFile(null)
    setVideoURL('')
    setIsPlaying(false)
    setDuration(0)
    setVideoAspect(null)
    setIsFullscreen(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const openFilePicker = () => {
    if (!fileInputRef.current) return
    // Clearing value ensures selecting the same file again triggers onChange
    fileInputRef.current.value = ''
    fileInputRef.current.click()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (!videoFile) {
      setErrorMessage('Please select a video before creating.')
      return
    }

    // Prevent accidental double submits or background calls
    if (isUploading) {
      console.warn('Upload already in progress; ignoring duplicate submit')
      return
    }

    const formData = new FormData()
    formData.append('video', videoFile)
    formData.append('name', name)
    formData.append('description', description)
  

    try {
      setIsUploading(true)
      setUploadProgress(0)

      const response = await axios.post('http://localhost:3000/api/food/', formData, {
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setUploadProgress(percent)
          }
        },
      })

      // success
      setSuccessMessage('Uploaded successfully')
      // Reset form fields
      setName('')
      setDescription('')
      setVideoFile(null)
      if (videoURL) URL.revokeObjectURL(videoURL)
      setVideoURL('')
      setVideoAspect(null)
      setDuration(0)
      setIsPlaying(false)
      if (fileInputRef.current) fileInputRef.current.value = ''

      // you can use response.data here
      console.log('upload response', response.data)

      // navigate to home and force a reload so the reels feed refreshes and shows the newly uploaded video
      setTimeout(() => {
        try {
          navigate('/', { replace: true })
          // small delay then reload to force feed refresh if the page had a stale cache/state
          setTimeout(() => window.location.reload(), 80)
        } catch (navErr) {
          console.warn('Navigation after upload failed', navErr)
        }
      }, 700)

    } catch (err) {
      console.error(err)
      setErrorMessage(err?.response?.data?.message || err.message || 'Upload failed')
    } finally {
      setIsUploading(false)
      setTimeout(() => setUploadProgress(0), 800)
    }
  }

  return (
    <div className="createfood-page">
      <div className="createfood-card">
        <h2 className="createfood-title">Create Food</h2>
        <p className="createfood-sub">Upload a short video, add a name and a brief description.</p>

        <form className="createfood-form">

          <label className="field">
            <span className="label">Video</span>
            <div className="video-upload">
              {videoURL ? (<> 
                <div
                  className="video-container"
                  role="button"
                  tabIndex={0}
                  style={videoAspect ? { aspectRatio: videoAspect } : undefined}
                  onClick={handleTogglePlay}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleTogglePlay(e)
                    if (e.key === 'f' || e.key === 'F') handleToggleFullScreen(e)
                  }}
                >
                  <video
                    ref={videoRef}
                    className="video-preview"
                    src={videoURL}
                    onLoadedMetadata={handleLoadedMetadata}
                    playsInline
                    muted
                  />

                  <div className="video-overlay">
                    <button
                      type="button"
                      className="play-button"
                      aria-label={isPlaying ? 'Pause video' : 'Play video'}
                      aria-pressed={isPlaying}
                      onClick={handleTogglePlay}
                    >
                      {isPlaying ? (
                        // pause icon
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <rect x="6" y="5" width="4" height="14" rx="1" />
                          <rect x="14" y="5" width="4" height="14" rx="1" />
                        </svg>
                      ) : (
                        // play icon
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path d="M5 3v18l15-9z" />
                        </svg>
                      )}
                    </button>
                  </div>

                  <button
                    type="button"
                    className="fullscreen-button"
                    title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                    aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                    onClick={handleToggleFullScreen}
                  >
                    {isFullscreen ? (
                      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M14 14h5v5h-5v-2h3v-3h-3v-2zM10 10H5V5h5v2H7v3h3v2z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M7 14H5v5h5v-2H7v-3zM17 5h-3V3h5v5h-2V5zM7 7h3V5H5v5h2V7zM17 17v-3h2v5h-5v-2h3z" />
                      </svg>
                    )}
                  </button>

                  {duration ? (
                    <div className="video-controls-bar video-controls-inside" onMouseDown={() => setIsScrubbing(true)} onMouseUp={() => setIsScrubbing(false)}>
                      <div className="time time-elapsed">{formatDuration(Math.floor(currentTime))}</div>
                      <div className="progress" onClick={handleSeek} onTouchStart={handleTouchSeek} role="slider" aria-valuemin={0} aria-valuemax={Math.floor(duration)} aria-valuenow={Math.floor(currentTime)} tabIndex={0}>
                        <div className="progress-filled" style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }} />
                        <div className="scrub" style={{ left: `${duration ? (currentTime / duration) * 100 : 0}%` }} />
                      </div>
                      <div className="time time-total">{formatDuration(Math.floor(duration))}</div>
                      <button type="button" className="fullscreen-inline-button" title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} onClick={handleToggleFullScreen} aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
                        {isFullscreen ? (
                          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M14 14h5v5h-5v-2h3v-3h-3v-2zM10 10H5V5h5v2H7v3h3v2z"/></svg>
                        ) : (
                          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M7 14H5v5h5v-2H7v-3zM17 5h-3V3h5v5h-2V5zM7 7h3V5H5v5h2V7zM17 17v-3h2v5h-5v-2h3z"/></svg>
                        )}
                      </button>
                    </div>
                  ) : null}

                </div> 

              </> ) : (
                <div className="video-drop" onClick={openFilePicker}> 
                  <svg className="upload-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M5 20h14a1 1 0 0 0 1-1V11h-2v8H6v-8H4v8a1 1 0 0 0 1 1zM12 3l5 5h-3v4h-4V8H7l5-5z" />
                  </svg>
                  <div className="file-meta">Choose a video (mp4, webm, mov)</div>
                  <button type="button" className="upload-btn" onClick={openFilePicker}>Upload</button>
                </div>
              )}

              {/* helper to reliably open the file picker and allow re-selecting same file */}
              
              <input
                ref={fileInputRef}
                className="file-input"
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                aria-label="Upload video"
              />

              {videoFile ? (
                <div className="video-controls">
                  <div className="video-filename" title={videoFile.name}>{videoFile.name}</div>
                  <div className="video-actions">
                    <button type="button" className="btn small" onClick={openFilePicker}>Change</button>
                    <button type="button" className="btn secondary small" onClick={handleRemoveVideo}>Remove</button>
                  </div>
                </div>
              ) : (
                <div className="file-meta"></div>
              )}
            </div>
          </label>

          <label className="field">
            <span className="label">Name</span>
            <input
              className="input"
              type="text"
              placeholder="e.g., Vegan Burger"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label className="field">
            <span className="label">Description</span>
            <textarea
              className="textarea"
              rows="4"
              placeholder="Write a short description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>




          <div className="actions">
            <button type="button" className="btn" onClick={handleSubmit} disabled={isUploading}>{isUploading ? `Uploading ${uploadProgress}%` : 'Create'}</button>
            <button
              type="button"
              className="btn secondary"
              onClick={() => {
                setName('')
                setDescription('')
                setVideoFile(null)
                setVideoURL('')
                if (fileInputRef.current) fileInputRef.current.value = ''
              }}
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateFood