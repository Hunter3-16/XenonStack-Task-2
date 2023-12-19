import React, { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
import Loader from '../GeneralScreens/Loader';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AuthContext } from "../../Context/AuthContext";
import '../../Css/EditStory.css'

const EditStory = () => {
    const { config } = useContext(AuthContext)
    const slug = useParams().slug
    const [loading, setLoading] = useState(true)
    const [story, setStory] = useState({})
    const [image, setImage] = useState('')
    const [previousImage, setPreviousImage] = useState('')
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {

        const getStoryInfo = async () => {
            setLoading(true)
            try {
                const { data } = await axios.get(`https://blogs-backends.onrender.com/story/editStory/${slug}`, config)
                setStory(data.data)
                setTitle(data.data.title)
                setContent(data.data.content)
                setImage(data.data.image)
                setPreviousImage(data.data.image)
                setLoading(false)
            }
            catch (error) {
                navigate("/")
            }
        }
        getStoryInfo()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formdata = new FormData()
        formdata.append("title", title)
        formdata.append("content", content)
        formdata.append("image", image)
        formdata.append("previousImage", previousImage)

        try {
            const { data } = await axios.put(`https://blogs-backends.onrender.com/story/${slug}/edit`, formdata, config)

            setSuccess('Edit Story successfully ')

            setTimeout(() => {
                navigate('/')
            }, 2500)

        }
        catch (error) {
            setTimeout(() => {
                setError('')
            }, 4500)
            setError(error.response.data.error)
        }
    }



    return (
        <>
            {
                loading ? <Loader /> : (
                    <div className="Inclusive-editStory-page ">
                        <form onSubmit={handleSubmit} className="editStory-form">

                            {error && <div className="error_msg">{error}</div>}
                            {success && <div className="success_msg">
                                <span>
                                    {success}
                                </span>
                                <Link to="/">Go To home</Link>
                            </div>}

                            <input
                                type="text"
                                required
                                id="title"
                                placeholder="Title"
                                onChange={(e) => setTitle(e.target.value)}
                                value={title}
                            />

                            <CKEditor
                                editor={ClassicEditor}
                                onChange={(e, editor) => {
                                    const data = editor.getData();
                                    setContent(data)
                                }}
                                data={content}
                            />
                            <button type='submit' className='editStory-btn'
                            >Edit Story </button>
                        </form>
                    </div>
                )
            }
        </>
    )
}

export default EditStory;
