import "./styles.css";
import axios from "axios";
import { useState, useRef } from "react";
export default function App() {
  const [files, setFiles] = useState([]);
  const inputFile = useRef(null);
  const UPLOAD_ENDPOINT = "";
  const onStage = (e) => {
    // console.log(inputFile.current.files[0]);
    if (inputFile.current.files && inputFile.current.files[0]) {
      const file = inputFile.current.files[0];
      if (fileType(file) !== "pdf" || fileSizeInMB(file) > 10)
        alert("Please select pdf file less than 10MB");
      else setFiles((current) => [...current, file]);

      inputFile.current.value = null; //reset file after stage
    }
  };
  const removeFile = (index) => {
    setFiles((current) => current.filter((item, i) => i !== index));
  };
  const uploadFiles = async () => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file[]", file);
    });
    return await axios.post(UPLOAD_ENDPOINT, formData, {
      headers: {
        "content-type": "multipart/form-data"
      }
    });
  };
  const fileSizeInMB = (file) => {
    return (file.size / 1024 / 1024).toFixed(4); // should less than 10 MB
  };
  const fileType = (file) => {
    return file.name.split(".").pop();
  };
  return (
    <div className="App">
      <div className="buttons">
        <input
          type="file"
          ref={inputFile}
          accept="application/pdf"
          onChange={onStage}
        />
        <button type="button" onClick={uploadFiles}>
          Save
        </button>
      </div>
      <table>
        <tbody>
          <tr>
            <th>FileName</th>
            <th>Size(MB)</th>
            <th>Action</th>
          </tr>
          {files.map((file, index) => {
            return (
              <tr key={index}>
                <td>{file.name}</td>
                <td>{fileSizeInMB(file)}</td>
                <td>
                  <button onClick={() => removeFile(index)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
