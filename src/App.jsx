import './App.css'
import dbService, { deleteEncryptionKey } from './db/db.service';

function App() {

  const handleOnCreateClick = () => {
    dbService.createTable()
  }

  const handleOnInsertClick = () => {
    dbService.insertRecord(2, "Vicky")
  }

  const handleOnSelectClick = () => {
    dbService.selectRecords()
  }

  const handleOnCheckKey = () => {
    dbService.checkKey()
  }

  const handleOnDeleteKey = () => {
    deleteEncryptionKey();
  }

  return (
    <>
      <div>
        <h1>Cap App</h1>
        <button onClick={handleOnCreateClick}>Create Table</button>
        <button onClick={handleOnInsertClick}>Insert Records</button>
        <button onClick={handleOnSelectClick}>Display Records</button>
        <button onClick={handleOnCheckKey}>Check Key</button>
        <button onClick={handleOnDeleteKey}>Delete Key</button>
      </div>
    </>
  )
}

export default App
