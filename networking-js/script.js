// tab navigation
const tabs = document.querySelectorAll(".tab");
const tabButtons = document.querySelectorAll(".tab-btn");

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    tabButtons.forEach(b => b.classList.remove("active"));
    tabs.forEach(t => t.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// profile func to get elements and prefill form if data exists locally
const profileForm = document.getElementById("profileForm");
const profileDisplay = document.getElementById("profileDisplay");
const editProfileBtn = document.getElementById("editProfileBtn");
const cancelEditBtn = document.getElementById("cancelEdit");
const connectionsSection = document.getElementById("connectionsSection");
const myConnections = document.getElementById("myConnections");

profileForm.addEventListener("submit", event => {
  event.preventDefault();
  try {
    const name = document.getElementById("name").value.trim();
    const career = document.getElementById("career").value.trim();
    const interests = document.getElementById("interests").value.trim();
    const bio = document.getElementById("bio").value.trim();

    const profileData = { name, career, interests, bio };
    localStorage.setItem("profile", JSON.stringify(profileData));
    showProfile();
  } catch (err) {
    console.error("Error saving profile:", err);
    alert("There was an error saving your profile.");
  }
});

//func to show profile or form based on saved data
function showProfile() {
  try {
    const saved = JSON.parse(localStorage.getItem("profile"));
    if (!saved) {
      profileForm.classList.remove("hidden");
      profileDisplay.classList.add("hidden");
      connectionsSection.classList.add("hidden");
      return;
    }

    document.getElementById("displayName").textContent = saved.name;
    document.getElementById("displayCareer").textContent = saved.career;
    document.getElementById("displayInterests").textContent = saved.interests;
    document.getElementById("displayBio").textContent = saved.bio;

    profileDisplay.style.display = "flex";
    profileForm.style.display = "none";
    connectionsSection.style.display = "block";

    showConnections();



  } catch (err) {
    console.error("Error displaying profile:", err);
  }
}

//edit profile button function to prefill form if data exists
editProfileBtn.addEventListener("click", () => {
  const saved = JSON.parse(localStorage.getItem("profile"));

  if (saved) {

    document.getElementById("name").value = saved.name || "";
    document.getElementById("career").value = saved.career || "";
    document.getElementById("interests").value = saved.interests || "";
    document.getElementById("bio").value = saved.bio || "";
    
  }
  //hide the sections to display the form
  profileForm.style.display = "flex";      
  profileDisplay.style.display = "none";     
  connectionsSection.style.display = "none";
});


//show sections again and hide form
cancelEditBtn.addEventListener("click", () => {
  profileForm.style.display = "none";        
  profileDisplay.style.display = "flex";    
  connectionsSection.style.display = "block"; 
});


//network page functions
// mock data to show connections
const networkList = document.getElementById("networkList");
const contacts = [
  { name: "Ariel Sanchez", field: "Web Development" },
  { name: "Karen Perdomo", field: "Data Science" },
  { name: "David Erazo", field: "Cybersecurity" },
  { name: "Olivia Smith", field: "Design" },
  { name: "Mia Johnson", field: "Frontend Developer" },
];
//display contacts dinamically and filter already connected ones
function displayContacts() {
  networkList.innerHTML = "";
  const connections = JSON.parse(localStorage.getItem("connections")) || [];

  const availableContacts = contacts.filter(
    c => !connections.some(conn => conn.name === c.name)
  );


//displaying cards for each contact
  availableContacts.forEach(contact => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${contact.name}</h3>
      <p>${contact.field}</p>
      <button>Add Connection</button>
    `;
    const btn = card.querySelector("button");

    btn.addEventListener("click", () => {
      btn.textContent = "Connected!";
      btn.disabled = true;

      setTimeout(() => {
        addConnection(contact);
      }, 1000);
    });

    networkList.appendChild(card);
  });

  if (availableContacts.length === 0) {
    networkList.innerHTML = `<p>All available people are already connected!</p>`;
  }
}

//add connection
function addConnection(contact) {
  const current = JSON.parse(localStorage.getItem("connections")) || [];
  current.push(contact);
  localStorage.setItem("connections", JSON.stringify(current));
  displayContacts();
  showConnections();
}


//show conection in my profile
function showConnections() {
  const connections = JSON.parse(localStorage.getItem("connections")) || [];
  myConnections.innerHTML = "";
  connections.forEach(c => {
    const card = document.createElement("div");
    card.className = "small-card";
    card.innerHTML = `
      <h4>${c.name}</h4>
      <p>${c.field}</p>
      <button class="removeBtn">Remove</button>
    `;
    card.querySelector(".removeBtn").addEventListener("click", () => removeConnection(c.name));
    myConnections.appendChild(card);
  });
}


//remove connection from profile
function removeConnection(name) {
  let current = JSON.parse(localStorage.getItem("connections")) || [];
  current = current.filter(c => c.name !== name);
  localStorage.setItem("connections", JSON.stringify(current));
  displayContacts();
  showConnections();
}

//posts
const postForm = document.getElementById("postForm");
const postList = document.getElementById("postList");

// Mock data para My Posts
const mockPosts = [
  { author: "Ariel Sanchez", text: "Just finished a new project!", date: "2025-10-01 14:22" },
  { author: "Karen Perdomo", text: "Learning React is fun!", date: "2025-10-02 09:15" },
  { author: "David Erazo", text: "Cybersecurity tips: always use 2FA!", date: "2025-10-03 17:40" }
];

//save mock if no posts 
let savedPosts = JSON.parse(localStorage.getItem("posts"));
if (!savedPosts || savedPosts.length === 0) {
  localStorage.setItem("posts", JSON.stringify(mockPosts));
  savedPosts = mockPosts;
}


//send post
postForm.addEventListener("submit", e => {
  e.preventDefault();
  const text = document.getElementById("postContent").value.trim();
  if (text === "") return;

  const profile = JSON.parse(localStorage.getItem("profile"));
  if (!profile || !profile.name) {
    alert("Please set up your profile first!");
    return;
  }

  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  posts.unshift({  //rempoved push to unshift to show newest first
    id: Date.now(),
    author: profile.name,
    text,
    date: new Date().toLocaleString()
  });
  localStorage.setItem("posts", JSON.stringify(posts));
  document.getElementById("postContent").value = "";
  showPosts();
});


//delete function for posts
function deletePost(id) {
  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  posts = posts.filter(p => p.id !== id);
  localStorage.setItem("posts", JSON.stringify(posts));
  showPosts();
}

//show all posts and create / delete
function showPosts() {
  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  const profile = JSON.parse(localStorage.getItem("profile"));
  postList.innerHTML = "";

  posts.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${p.author}</strong> <em>${p.date}</em>
      <br>${p.text}
    `;

    // Only add delete button if post belongs to current profile
    if (profile && profile.name === p.author) {
      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.className = "removeBtn";
      delBtn.style.float = "right";
      delBtn.addEventListener("click", () => deletePost(p.id));
      li.appendChild(delBtn);
    }

    postList.appendChild(li);
  });
}

//init page
showProfile();
displayContacts();
showPosts();
