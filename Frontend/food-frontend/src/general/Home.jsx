import React, { useEffect, useRef, useCallback, useState } from "react";
import "../styles/reels.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const containerRef = useRef(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const likingRefs = React.useRef(new Set());
  const savingRefs = React.useRef(new Set());
  const [quantity, setQuantity] = useState({});


  // observe video elements whenever the list changes
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const videoNodes = container.querySelectorAll("video");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.65 }
    );

    videoNodes.forEach((v) => observer.observe(v));

    return () => observer.disconnect();
  }, [videos]);

  // fetch real videos once on mount
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3000/api/food/", { withCredentials: true })
      .then((response) => {
        const items = response?.data?.foodItems || [];
        setVideos(items);
      })
      .catch(() => {
        // on error keep videos empty
        setVideos([]);
      })
      .finally(() => setLoading(false));
  }, []);
  const togglePlay = useCallback((id) => {
    const container = containerRef.current;
    if (!container) return;
    const v = container.querySelector(`video[data-id="${id}"]`);
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  }, []);

  const handleLike = async (item) => {
    // if (!item || !item._id) return
    // if (likingRefs.current.has(item._id)) return
    // likingRefs.current.add(item._id)

    // const curCount = item.likeCount ?? item.likes ?? 0
    // const currentlyLiked = !!(item.liked ?? item.isLiked)
    // // optimistic update
    // setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, liked: !currentlyLiked, likeCount: Math.max(0, curCount + (currentlyLiked ? -1 : 1)), likes: Math.max(0, curCount + (currentlyLiked ? -1 : 1)) } : v))

    // try {
    //   const resp = await axios.post('http://localhost:3000/api/food/like', { foodId: item._id }, { withCredentials: true })
    //   // reconcile with server response when possible
    //   if (resp?.data?.liked !== undefined) {
    //     const liked = !!resp.data.liked
    //     setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, liked, likeCount: typeof resp.data.likeCount === 'number' ? resp.data.likeCount : v.likeCount } : v))
    //   }
    // } catch (err) {
    //   // revert optimistic change on error
    //   setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, liked: currentlyLiked, likeCount: curCount, likes: curCount } : v))
    // } finally {
    //   likingRefs.current.delete(item._id)
    //biji rit  }

    const res = await axios.post(
      "http://localhost:3000/api/food/like",
      { foodId: item._id },
      { withCredentials: true }
    );

    setVideos((prev) =>
      prev.map((v) =>
        v._id === item._id
          ? { ...v, liked: res.data.liked, likeCount: res.data.likeCount }
          : v
      )
    );
  };

  // const handleSave = async (item) => {
  //   if (!item || !item._id) return
  //   if (savingRefs.current.has(item._id)) return
  //   savingRefs.current.add(item._id)

  //   const curCount = item.savesCount ?? item.save ?? item.saves ?? 0
  //   const currentlySaved = !!(item.saved ?? item.isSaved)
  //   // optimistic update
  //   setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, saved: !currentlySaved, savesCount: Math.max(0, curCount + (currentlySaved ? -1 : 1)), save: Math.max(0, curCount + (currentlySaved ? -1 : 1)) } : v))

  //   try {
  //     const resp = await axios.post('http://localhost:3000/api/food/save', { foodId: item._id }, { withCredentials: true })
  //     if (resp?.data?.saved !== undefined) {
  //       const saved = !!resp.data.saved
  //       setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, saved, savesCount: typeof resp.data.savesCount === 'number' ? resp.data.savesCount : v.savesCount } : v))
  //     }
  //   } catch (err) {
  //     // revert optimistic change on error
  //     setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, saved: currentlySaved, saveCount: curCount, save: curCount } : v))
  //   } finally {
  //     savingRefs.current.delete(item._id)
  //   }
  //     //  const res = await axios.post("http://localhost:3000/api/food/save", { foodId: item._id }, { withCredentials: true })

  //     //       setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v,saved:res.data.saved, saveCount:res.data.saveCount   } : v))

  // }
  const handleSave = async (item) => {
    const res = await axios.post(
      "http://localhost:3000/api/food/save",
      { foodId: item._id },
      { withCredentials: true }
    );
    // revert optimistic change on error
    console.log("SAVE API RESPONSE 👉", res.data);

    setVideos((prev) =>
      prev.map((v) =>
        v._id === item._id
          ? { ...v, saved: res.data.saved, saveCount: res.data.saveCount }
          : v
      )
    );

    //  const res = await axios.post("http://localhost:3000/api/food/save", { foodId: item._id }, { withCredentials: true })

    //       setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v,saved:res.data.saved, saveCount:res.data.saveCount   } : v))
  };

  const handleBuy = async (item,qty) => {
    try {
      const resp = await axios.post(
        "http://localhost:3000/api/buy/",
        { foodId: item._id, quantity: qty },
        { withCredentials: true }
      );
const buy = resp.data.buy;

      // console.log("BUY API RESPONSE 👉", resp.data);

      if (buy && buy._id) {
        navigate(`/checkout/${buy._id}`);
      } else {
        alert("Unable to create purchase. Try again.");
      }
    } catch (err) {
      console.error("create buy error", err);
      alert("Error creating purchase. Are you logged in?");
    }
  };

  if (loading) {
    return (
      <div
        className="reels-container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          color: "#fff",
        }}
      >
        Loading reels…
      </div>
    );
  }

  if (!loading && videos.length === 0) {
    return (
      <div
        className="reels-container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          color: "#fff",
        }}
      >
        No videos available
      </div>
    );
  }

  return (
    <div className="reels-container" ref={containerRef}>
      {videos.map((item) => (
        <section
          className="reel-item"
          key={item._id}
          onClick={() => togglePlay(item._id)}
          aria-label={`Reel ${item._id}`}
        >
          <video
            className="reel-video"
            data-id={item._id}
            src={item.video}
            playsInline
            muted
            autoPlay
            loop
            preload="metadata"
          />

          <div className="reel-gradient" />

          <div className="reel-overlay modern">
            <div className="reel-left">
              <div className="store-badge"> {item.foodPartner?.name}</div>
              <div className="reel-description">{item.description}</div>
              <div className="reel-meta">Open • 15–25 min • 4.6★</div>

              <Link
                className="reel-button primary"
                to={
                  "/food-partner/" +
                  (item.foodPartner?._id ||
                    item.foodPartner?.id ||
                    item.foodPartner)
                }
                aria-label={`Visit ${item.store}`}
                onClick={(e) => e.stopPropagation()}
              >
                Visit {item.foodPartner?.name}
              </Link>

              {/* 🔥 QUANTITY + BUY */}
              <div className="buy-box">
                <div className="qty-control">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuantity((q) => ({
                        ...q,
                        [item._id]: Math.max(1, (q[item._id] || 1) - 1),
                      }));
                    }}
                  >
                    −
                  </button>

                  <span>{quantity[item._id] || 1}</span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuantity((q) => ({
                        ...q,
                        [item._id]: (q[item._id] || 1) + 1,
                      }));
                    }}
                  >
                    +
                  </button>
                </div>

                <button
                  className="reel-button secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBuy(item, quantity[item._id] || 1);
                  }}
                >
                  Buy • ₹{item.price * (quantity[item._id] || 1)}
                </button>
              </div>
            </div>

            <div className="reel-right" aria-hidden="false">
              <button
                className={
                  "action-btn like" +
                  (item.liked ?? item.isLiked ? " active" : "")
                }
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(item);
                }}
                aria-label="Like"
                aria-pressed={item.liked ?? item.isLiked ?? false}
              >
                <svg
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M12 21s-7.33-4.34-9.09-7.02C1.59 11.9 3.09 6 8 6c2.54 0 3.9 1.72 4 2 .1-.28 1.45-2 4-2 4.91 0 6.41 5.9 4.09 7.98C19.33 16.66 12 21 12 21z" />
                </svg>
                <div className="action-count">
                  {item.likeCount ?? item.likes}
                </div>
              </button>

              <button
                className="action-btn comment"
                onClick={(e) => e.stopPropagation()}
                aria-label="Comment"
              >
                <svg
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M21 6h-18v12h4v4l4-4h10z" />
                </svg>
                <div className="action-count">
                  {(item.comments && item.comments.length) ||
                    item.comments ||
                    0}
                </div>
              </button>

              <button
                className={
                  "action-btn save" +
                  (item.saved ?? item.isSaved ? " active" : "")
                }
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave(item);
                }}
                aria-label="Save"
                aria-pressed={item.saved ?? item.isSaved ?? false}
              >
                <svg
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M6 2h12a1 1 0 0 1 1 1v18l-7-4-7 4V3a1 1 0 0 1 1-1z" />
                </svg>
                <div className="action-count">
                  {item.saveCount ?? item.save ?? item.saves ?? 0}
                </div>
              </button>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default Home;
