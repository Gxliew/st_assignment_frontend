import React, { useCallback, useState } from 'react'
import './App.css'
import axios from 'axios'
import Table from './components/table'

function App() {
  const [data, setData] = useState<any[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState<string>('')
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const fetchData = useCallback(async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/read`, {
        file_name: file?.name ?? ""
      })
      setData(response.data)
    } catch(error) {
      alert(error.response.data.error)
    }
  
  }, [file])

  const handleFileChange = useCallback((e) => {
    setFile(e.target.files[0])
  }, [])

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file.')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          let progress = uploadProgress
          if (progressEvent.total) {
            progress = (progressEvent.loaded / progressEvent.total) * 100
          }
          setUploadProgress(progress)
        }
      })
      setMessage('')
      fetchData()
    } catch (error) {
      setMessage('An error occurred while uploading the file.')
    }
  }

  return (
    <div className='App'>
      <div style={{ padding: '20px' }}>
        <h2>Data Uploader and Viewer</h2>
        <input type='file' onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
        {!message && uploadProgress > 0 && <h2>{uploadProgress}% uploaded</h2>}
        {message && <p style={{ color: 'red' }}>{message}</p>}
      </div>
      <hr />
      <Table data={data} />
    </div>
  )
}

export default App

