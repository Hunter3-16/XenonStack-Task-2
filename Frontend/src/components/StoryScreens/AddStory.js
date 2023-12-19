import React, { useRef, useContext } from 'react'
import { useState , useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AuthContext } from "../../Context/AuthContext";
import { FiArrowLeft } from 'react-icons/fi'
import '../../Css/AddStory.css'

const AddStory = () => {

    const { config } = useContext(AuthContext)
    const imageEl = useRef(null)
    const editorEl = useRef(null)
    const [image, setImage] = useState('')
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [previewUrl, setPreviewUrl] = useState()

    const clearInputs = () => {
        setTitle('')
        setContent('')
        setImage('')
        editorEl.current.editor.setData('')
        imageEl.current.value = ""
    }
    useEffect(() => {
        if(!image){
            return
        }
        const fileReader = new FileReader()
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result)
        }
        fileReader.readAsDataURL(image)
    },[image]) 
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formdata = new FormData()
        formdata.append("title", title)
        formdata.append("image", image)
        formdata.append("content", content)
        try {
            const { data } = await axios.post("https://blogs-backends.onrender.com/story/addstory", formdata, config)
            setSuccess('Add story successfully ')
            clearInputs()
            setTimeout(() => {
                setSuccess('')
            }, 7000)
        }
        catch (error) {
            setTimeout(() => {
                setError('')
            }, 7000)
            setError(error.response.data.error)
        }
    }
    return (
        <div className="Inclusive-addStory-page ">
            <Link to={'/'} >
                <FiArrowLeft />
            </Link>
            <form onSubmit={handleSubmit} className="addStory-form">
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
                    ref={editorEl}
                />
                <button type='submit' className={'addStory-btn'}
                >Publish Blog </button>
            </form>
        </div>
    )
}

export default AddStory


