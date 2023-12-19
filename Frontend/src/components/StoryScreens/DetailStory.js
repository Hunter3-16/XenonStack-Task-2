import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import "../../Css/DetailStory.css"
import Loader from '../GeneralScreens/Loader';
import { RiDeleteBin6Line } from 'react-icons/ri'
import { FiEdit, FiArrowLeft } from 'react-icons/fi'
import { FaRegComment } from 'react-icons/fa'

const DetailStory = () => {
  const [activeUser, setActiveUser] = useState({})
  const [story, setStory] = useState({})
  const [sidebarShowStatus, setSidebarShowStatus] = useState(false)
  const [loading, setLoading] = useState(true)
  const slug = useParams().slug
  const navigate = useNavigate()

  useEffect(() => {

    const getDetailStory = async () => {
      setLoading(true)
      var activeUser = {}
      try {
        const { data } = await axios.get("https://blogs-backends.onrender.com/auth/private", {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        activeUser = data.user

        setActiveUser(activeUser)

      }
      catch (error) {
        setActiveUser({})
      }

      try {
        const { data } = await axios.post(`https://blogs-backends.onrender.com/story/${slug}`, { activeUser })
        setStory(data.data)
        setLoading(false)

      }
      catch (error) {
        setStory({})
        navigate("/not-found")
      }

    }
    getDetailStory();

  }, [slug, setLoading])



  

  const handleDelete = async () => {

    if (window.confirm("Do you want to delete this post")) {

      try {

        await axios.delete(`https://blogs-backends.onrender.com/story/${slug}/delete`, {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        })
        navigate("/")

      }
      catch (error) {
        console.log(error)
      }

    }

  }


  const editDate = (createdAt) => {

    const d = new Date(createdAt)
      ;
    var datestring = d.toLocaleString('eng', { month: 'long' }).substring(0, 3) + " " + d.getDate()
    return datestring
  }


  return (
    <>
      {
        loading ? <Loader /> :
          <>
            <div className='Inclusive-detailStory-page'>
              <div className="top_detail_wrapper">
                <Link to={'/'} >
                  <FiArrowLeft />
                </Link>
                <h5>{story.title}</h5>
                <div className='story-general-info'>
                  <ul>
                    {story.author &&
                      <li className='story-author-info'>
                        <span className='story-author-username'>{story.author.username}  </span>
                      </li>
                    }
                    <li className='story-createdAt'>
                      {
                        editDate(story.createdAt)
                      }
                    </li>
                  </ul>
                  {
                    !activeUser.username &&
                    <div className='comment-info-wrap'>
                      <i onClick={(prev) => {
                        setSidebarShowStatus(!sidebarShowStatus)
                      }}>
                        <FaRegComment />
                      </i>
                    </div>
                  }
                  {activeUser && story.author &&
                    story.author._id === activeUser._id ?
                    <div className="top_story_transactions">
                      <Link className='editStoryLink' to={`/story/${story.slug}/edit`}>
                        <FiEdit />
                      </Link>
                      <span className='deleteStoryLink' onClick={handleDelete}>
                        <RiDeleteBin6Line />
                      </span>
                    </div> : null
                  }
                </div>
              </div>
              <div className='story-content' >
                <div className='content' dangerouslySetInnerHTML={{ __html: (story.content) }}>
                </div>
              </div>
              {activeUser.username &&
                <div className='fixed-story-options'>
                  <ul>
                    <li className='BsThreeDots_opt'>
                      {activeUser &&
                        story.author._id === activeUser._id ?
                        <div className="delete_or_edit_story  ">
                          <Link className='editStoryLink' to={`/story/${story.slug}/edit`}>
                            <p>Edit Story</p>
                          </Link>
                          <div className='deleteStoryLink' onClick={handleDelete}>
                            <p>Delete Story</p>
                          </div>
                        </div> : null
                      }

                    </li>

                  </ul>

                </div>
              }

            </div>
          </>
      }
    </>
  )
}

export default DetailStory;
