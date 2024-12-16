import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import axios from "axios";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./List.css";

const Notes = ({ token, searchQuery }) => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [users, setUsers] = useState([]);
  const [formMode, setFormMode] = useState("add"); // "add" or "update"
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [selectedUser,setSelectedUser] =useState([])

  // Fetch Notes
  useEffect(() => {
    const getNotes = async () => {
      try {
        const res = await axios.get("https://notes.devlop.tech/api/notes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const notesWithFormattedDate = res.data.map((note) => {
          const cleanedDate = note.date.replace(".000000Z", "Z");
          const formattedDate = format(new Date(cleanedDate), "MMM d, HH:mm");
          return {
            ...note,
            formattedDate,
            shared_with: note.shared_with || []

          };
        });
        setNotes(notesWithFormattedDate);
        setFilteredNotes(notesWithFormattedDate);


      } catch (err) {
        console.error("Failed to fetch notes: ", err);
        setNotes([]);

      }
    };

    getNotes();
  }, [token]);

  // Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("https://notes.devlop.tech/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userOptions = res.data.map((user) => ({
          value: user.id, // Map id to value
          label: `${user.first_name} ${user.last_name}`, // User name
        }));
        setUsers(userOptions);
      } catch (err) {
        console.error("Failed to fetch users: ", err);
      }
    };

    fetchUsers();
  }, [token]);





  // Filter Notes based on Search Query
  useEffect(() => {
    const filtered = notes.filter((note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredNotes(filtered);
  }, [searchQuery, notes]);




  // Add or Update Note Submission
  const onFormSubmit = async (e) => {
    e.preventDefault();
    

    try {
      if (formMode === "update") {
        // Update Note
        const res = await axios.put(
          `https://notes.devlop.tech/api/notes/${editingNoteId}`,
          {title:newNoteTitle,content:newNoteContent},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.id === editingNoteId ? { ...res.data } : note
          )
        );
      } else {
         // Add Note
        const res = await axios.post(
          "https://notes.devlop.tech/api/notes",
          {title:newNoteTitle,content:newNoteContent ,shared_with: selectedUser.map((user)=>user.value)},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotes((prevNotes) => [...prevNotes, res.data]);
      }
    } catch (err) {
      console.error(`Failed to ${formMode === "update" ? "update" : "add"} note: `, err);
    }

    setNewNoteTitle("");
    setNewNoteContent("");
    setEditingNoteId(null);
    setSelectedUser([]);
  };

  // Delete Note
  const deleteNote = async (id) => {
    try {
      await axios.delete(`https://notes.devlop.tech/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((note) => note.id !== id));
    } catch (err) {
      console.error("Failed to delete note: ", err);
    }
  };

  // Handle Add Note
  const handleAddNote = () => {
    setFormMode("add");
    setNewNoteTitle("");
    setNewNoteContent("");
    const offcanvasElement = document.getElementById("staticBackdrop");
    const bootstrapOffcanvas = new window.bootstrap.Offcanvas(offcanvasElement);
    bootstrapOffcanvas.show();
  };

  // Handle Edit Note
  const handleEditNote = (note) => {
    setFormMode("update");
    setEditingNoteId(note.id);
    setNewNoteTitle(note.title);
    setNewNoteContent(note.content);
    const offcanvasElement = document.getElementById("staticBackdrop");
    const bootstrapOffcanvas = new window.bootstrap.Offcanvas(offcanvasElement);
    bootstrapOffcanvas.show();
  };

  return (
    <div className="list-container">
      {/* Add Note Button */}
      <img
        src="./images/add.png" className="add-image" type="button" onClick={handleAddNote} alt="im" />

      {/* Offcanvas Form */}
      <div className="offcanvas offcanvas-start" tabIndex="-1" id="staticBackdrop" aria-labelledby="staticBackdropLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="staticBackdropLabel">
            {formMode === "add" ? "Add a New Note" : "Update Note"}
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <form onSubmit={onFormSubmit}>
            <div className="mb-3">
              <label htmlFor="note-title" className="form-label">
                Title
              </label>
              <input
                type="text"
                className="form-control"
                id="note-title"
                placeholder="Note Title"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="note-content" className="form-label">
                Content
              </label>
              <textarea
                className="form-control"
                id="note-content"
                rows="3"
                placeholder="Note Content"
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                required
              ></textarea>
            </div>
            
            {formMode === "add" && <div className="mb-3">
              <label htmlFor="note-user" className="form-label">
                Assign to User
              </label>
              <Select
                options={users}
                placeholder="Select a user"
                value={selectedUser}
                onChange={(selectedoption) =>setSelectedUser(selectedoption)}
                isMulti
                
              />
            </div>}
            <div className="form-buttons">
              <button type="submit" className="save-btn btn btn-success">
                {formMode === "add" ? "Save Note" : "Update Note"}
              </button>
              <button
                type="button"
                className="cancel-btn btn btn-secondary"
                data-bs-dismiss="offcanvas"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Notes List */}
      <div className="notes-list">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <div
              className="note-card"
              key={note.id}
              style={{ backgroundColor: note.color || "#ffffff" }}
            >
              <div className="note-header">
                <h2>{note.title}</h2>
                <div className="note-actions">
                  <img
                    id="x"
                    src="./images/xmark.png"
                    alt="Delete Note"
                    onClick={() => deleteNote(note.id)}
                    className="action-icon"
                  />
                  <img
                    id="edit"
                    src="./images/edit.png"
                    alt="Edit Note"
                    onClick={() => handleEditNote(note)}
                    className="action-icon"
                  />
                </div>
              </div>
              <p>{note.content}</p>
              <div className="note-footer">
                <small>{note.formattedDate}</small>
              </div>
            </div>
          ))
        ) : (
          <p>No notes found</p>
        )}
      </div>
    </div>
  );
};

export default Notes;
