14 days left

Anirban :
 1st week - video calling fetures, creating databaces, authentications, chats...
 2nd week -No work just chill
 3rd week - Sleep beta




Shaswata: main task (update readme everyday, Ai part, extra fetures, suggest improvement)
 1st week - Create and display the live job roles according to the resume(NO AI involved) ## Done
 2nd week - intergate this start working on AI voice interview ## Yet to do
 3rd week -



Dipankar: main task ( all design  template chose , css and pages design )
 1st week - find the theme and start working on pages what build initialy make it dyam or suck my dick
 2nd week -
 3rd week -

Soumadeep: main task ( integrate part , tailwind and all setup, drawing thing implement )
 1st week - work on setup and start working on drawing thing
 2nd week -
 3rd week -


<nav class="top-navbar">
	<div class="navbar-content">
	  <h1 class="navbar-title">InternPortal</h1>
	  <!-- Search Bar -->
<div class="search-bar">
  <input type="text" placeholder="Search..." />
  <button type="submit">
	<svg class="search-icon" viewBox="0 0 24 24">
	  <circle cx="11" cy="11" r="8" stroke="white" stroke-width="2" fill="none"/>
	  <line x1="17" y1="17" x2="22" y2="22" stroke="white" stroke-width="2"/>
	</svg>
  </button>
</div>
	  <nav class="navbar-links">
		<a href="#">Home</a>
		<a href="#">About</a>
		<a href="#">Contact</a>
		<a href="#">Help</a>
	  </nav>
	  <img src="https://images.unsplash.com/photo-1544502062-f82887f03d1c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3" alt="Profile" class="profile-pic" />
	  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" />
	</div>
  </nav>

  <style>
	*{
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family: "Poppins", sans-serif;
	  }
	.top-navbar {
		grid-area: navbar;
		position: sticky;
		top: 0;
		left: 0;
		right: 0;
		height: 70px;
		display: flex;
		align-items: center;
		z-index: 1000;
		padding: 0 20px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		border-style: hidden;
		border: 10px;
		border-color: white;
		background:#004aad;
	}

	  .navbar-content {
		display: flex;
		justify-content: space-between;
		width: 100%;
		align-items: center;
		border: 26px;
		border-color: #004aad;
		background:#004aad;
		border-radius: 10px;
		padding: 0px;
	  }

	  .navbar-title {
		font-size: 1.5rem;
		margin: 0;
		color: white;
	  }
	  .navbar-links{
		align-items: center;
	  }
	  .navbar-links a {
		color: white;
		margin-left: 20px;
		text-decoration: none;
		font-weight: 500;
		align-items: center;
	  }

	  .navbar-links a:hover {
		text-decoration: underline;
	  }

	  .search-bar {
		display: flex;
		align-items: center;
		background:#004aad;
		border-radius: 50px;
		padding: 3px 10px;
		width: 400px;
		border: 2px solid;
		color: white;
	  }

	  .search-bar input {
		flex: 1;
		border: none;
		padding: 5px 15px;
		border-radius: 50px;
		outline: none;
		font-size: 14px;
		background: transparent;
		color: white;
	  }

	  .search-bar button {
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 8px;
		display: flex;
		align-items: center;
	  }

	  .search-icon {
		width: 20px;
		height: 20px;
	  }

	  .profile-pic {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		object-fit: cover;
		cursor: pointer;
		align-items: center;
	  }
  </style>






sidebar
<aside class="sidebar">
  <!-- Sidebar Header -->
  <header class="sidebar-header">
    <a href="#" class="header-logo">
      <img src="https://images.unsplash.com/photo-1544502062-f82887f03d1c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3" alt="ProfilePic" />
    </a>
    <button class="sidebar-toggler">
      <span class="material-symbols-rounded">chevron_left</span>
    </button>
  </header>
  <nav class="sidebar-nav">
    <!-- Primary Top Nav -->
    <ul class="nav-list primary-nav">
      <li class="nav-item">
        <a href="#" class="nav-link">
          <span class="material-symbols-rounded">dashboard</span>
          <span class="nav-label">Dashboard</span>
        </a>
        <ul class="dropdown-menu">
          <li class="nav-item"><a class="nav-link dropdown-title">Dashboard</a></li>
        </ul>
      </li>
      <!-- Dropdown -->
      <li class="nav-item dropdown-container">
        <a href="#" class="nav-link dropdown-toggle">
          <span class="material-symbols-rounded">calendar_today</span>
          <span class="nav-label">Services</span>
          <span class="dropdown-icon material-symbols-rounded">keyboard_arrow_down</span>
        </a>
        <!-- Dropdown Menu -->
        <ul class="dropdown-menu">
          <li class="nav-item"><a class="nav-link dropdown-title">Services</a></li>
          <li class="nav-item"><a href="#" class="nav-link dropdown-link">IT Consulting</a></li>
          <li class="nav-item"><a href="#" class="nav-link dropdown-link">Cloud Solutions</a></li>
          <li class="nav-item"><a href="#" class="nav-link dropdown-link">Mobile Apps</a></li>
        </ul>
      </li>
      <li class="nav-item">
        <a href="#" class="nav-link">
          <span class="material-symbols-rounded">notifications</span>
          <span class="nav-label">Notifications</span>
        </a>
        <ul class="dropdown-menu">
          <li class="nav-item"><a class="nav-link dropdown-title">Notifications</a></li>
        </ul>
      </li>
      <li class="nav-item">
        <a href="#" class="nav-link">
          <span class="material-symbols-rounded">local_library</span>
          <span class="nav-label">Resources</span>
        </a>
        <ul class="dropdown-menu">
          <li class="nav-item"><a class="nav-link dropdown-title">Resources</a></li>
        </ul>
      </li>
      <!-- Dropdown -->
      <li class="nav-item dropdown-container">
        <a href="#" class="nav-link dropdown-toggle">
          <span class="material-symbols-rounded">star</span>
          <span class="nav-label">Bookmarks</span>
          <span class="dropdown-icon material-symbols-rounded">keyboard_arrow_down</span>
        </a>
        <!-- Dropdown Menu -->
        <ul class="dropdown-menu">
          <li class="nav-item"><a class="nav-link dropdown-title">Bookmarks</a></li>
          <li class="nav-item"><a href="#" class="nav-link dropdown-link">Saved Tutorials</a></li>
          <li class="nav-item"><a href="#" class="nav-link dropdown-link">Favorite Blogs</a></li>
          <li class="nav-item"><a href="#" class="nav-link dropdown-link">Resource Guides</a></li>
        </ul>
      </li>

      <li class="nav-item">
        <a href="#" class="nav-link">
          <span class="material-symbols-rounded">settings</span>
          <span class="nav-label">Settings</span>
        </a>
        <ul class="dropdown-menu">
          <li class="nav-item"><a class="nav-link dropdown-title">Settings</a></li>
        </ul>
      </li>
    </ul>
    <!-- Secondary Bottom Nav -->
    <ul class="nav-list secondary-nav">
      <li class="nav-item">
        <a href="#" class="nav-link">
          <span class="material-symbols-rounded">help</span>
          <span class="nav-label">Support</span>
        </a>
        <ul class="dropdown-menu">
          <li class="nav-item"><a class="nav-link dropdown-title">Support</a></li>
        </ul>
      </li>
      <li class="nav-item">
        <a href="#" class="nav-link">
          <span class="material-symbols-rounded">logout</span>
          <span class="nav-label">Sign Out</span>
        </a>
        <ul class="dropdown-menu">
          <li class="nav-item"><a class="nav-link dropdown-title">Sign Out</a></li>
        </ul>
      </li>
    </ul>
  </nav>
</aside>

<style>
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Poppins", sans-serif;
  }
  .sidebar {
    grid-area: sidebar;
    height:calc(100vh - 73px);
    position: fixed;
    top: 73px;
    align-self: start;
    left: 0;
    z-index: 10;
    background:#004aad;
    transition: all 0.4s ease;
    border-radius: px;
  }
  .sidebar.collapsed {
    width: 85px;
  }
  .sidebar .sidebar-header {
    display: flex;
    position: relative;
    padding: 15px 20px;
    align-items: center;
    justify-content: space-between;
  }
  .sidebar-header .header-logo img {
    width: 46px;
    height: 46px;
    display: block;
    object-fit: contain;
    border-radius: 50%;
  }
  .sidebar-header .sidebar-toggler,
  .sidebar-menu-button {
    position: absolute;
    right: 20px;
    height: 35px;
    width: 35px;
    color: #3191ab;
    border: none;
    cursor: pointer;
    display: flex;
    background: #EEF2FF;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    transition: 0.4s ease;
  }
  .sidebar.collapsed .sidebar-header .sidebar-toggler {
    transform: translate(-4px, 65px);
  }
  .sidebar-header .sidebar-toggler span,
  .sidebar-menu-button span {
    font-size: 1.75rem;
    transition: 0.4s ease;
  }
  .sidebar.collapsed .sidebar-header .sidebar-toggler span {
    transform: rotate(180deg);
  }
  .sidebar-header .sidebar-toggler:hover {
    background: #d9e1fd;
  }
  .sidebar-nav .nav-list {
    list-style: none;
    display: flex;
    gap: 0px;
    padding: 0 15px;
    flex-direction: column;
    transform: translateY(15px);
    transition: 0.4s ease;
  }
  .sidebar .sidebar-nav .primary-nav {
    overflow-y: auto;
    scrollbar-width: thin;
    padding-bottom: 20px;
    height: calc(100vh - 227px);
    scrollbar-color: transparent transparent;
  }
  .sidebar .sidebar-nav .primary-nav:hover {
    scrollbar-color: #EEF2FF transparent;
  }
  .sidebar.collapsed .sidebar-nav .primary-nav {
    overflow: unset;
    transform: translateY(65px);
  }
  .sidebar-nav .nav-item .nav-link {
    color: #fff;
    display: flex;
    gap: 12px;
    white-space: nowrap;
    border-radius: 8px;
    padding: 11px 15px;
    align-items: center;
    text-decoration: none;
    border: 1px solid #151A2D;
    transition: 0.4s ease;
  }
  .sidebar-nav .nav-item:is(:hover, .open)>.nav-link:not(.dropdown-title) {
    color: #151A2D;
    background: #EEF2FF;
  }
  .sidebar .nav-link .nav-label {
    transition: opacity 0.3s ease;
  }
  .sidebar.collapsed .nav-link :where(.nav-label, .dropdown-icon) {
    opacity: 0;
    pointer-events: none;
  }
  .sidebar.collapsed .nav-link .dropdown-icon {
    transition: opacity 0.3s 0s ease;
  }
  .sidebar-nav .secondary-nav {
    position: absolute;
    bottom: 25px;
    width: 100%;
    background: #004aad;
  }
  .sidebar-nav .nav-item {
    position: relative;
  }
  /* Dropdown Stylings */
  .sidebar-nav .dropdown-container .dropdown-icon {
    margin: 0 -4px 0 auto;
    transition: transform 0.4s ease, opacity 0.3s 0.2s ease;
  }
  .sidebar-nav .dropdown-container.open .dropdown-icon {
    transform: rotate(180deg);
  }
  .sidebar-nav .dropdown-menu {
    height: 0;
    overflow-y: hidden;
    list-style: none;
    padding-left: 15px;
    transition: height 0.4s ease;
  }
  .sidebar.collapsed .dropdown-menu {
    position: absolute;
    top: -10px;
    left: 100%;
    opacity: 0;
    height: auto !important;
    padding-right: 10px;
    overflow-y: unset;
    pointer-events: none;
    border-radius: 0 10px 10px 0;
    background: #151A2D;
    transition: 0s;
  }
  .sidebar.collapsed .dropdown-menu:has(.dropdown-link) {
    padding: 7px 10px 7px 24px;
  }
  .sidebar.sidebar.collapsed .nav-item:hover>.dropdown-menu {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(12px);
    transition: all 0.4s ease;
  }
  .sidebar.sidebar.collapsed .nav-item:hover>.dropdown-menu:has(.dropdown-link) {
    transform: translateY(10px);
  }
  .dropdown-menu .nav-item .nav-link {
    color: #F1F4FF;
    padding: 9px 15px;
  }
  .sidebar.collapsed .dropdown-menu .nav-link {
    padding: 7px 15px;
  }
  .dropdown-menu .nav-item .nav-link.dropdown-title {
    display: none;
    color: #fff;
    padding: 9px 15px;
  }
  .dropdown-menu:has(.dropdown-link) .nav-item .dropdown-title {
    font-weight: 500;
    padding: 7px 15px;
  }
  .sidebar.collapsed .dropdown-menu .nav-item .dropdown-title {
    display: block;
  }
  .sidebar-menu-button {
    display: none;
  }
</style>



<footer>
  <div class="row">
    <div class="col">
      <img src="logo.png" class="logo">
      <p>Dipankar</p>
    </div>
    <div class="col">
      <h3>Office</h3>
      <p>ITPL Road</p>
      <p>ITPL Road</p>
      <p>ITPL Road</p>
      <p class="email-id">mannagopal2002@gmail.com</p>
      <h4>9330831609</h4>
    </div>
    <div class="col">
      <h3>Links</h3>
      <ul>
        <li><a href="">Home</a></li>
        <li><a href="">Services</a></li>
        <li><a href="">About us</a></li>
        <li><a href="">Features</a></li>
        <li><a href="">Contacts</a></li>
      </ul>
    </div>
    <div class="col">
      <h3>Newsletter</h3>
      <form>
        <i class="fa-solid fa-envelope"></i>
        <input type="email" placeholder="Enter your emil id" required>
        <button type="submit"><i class="fa-solid fa-arrow-right-to-bracket"></i></button>
      </form>
      <div class="social-icons">
        <i class="fa-brands fa-facebook"></i>
        <i class="fa-brands fa-twitter"></i>
        <i class="fa-brands fa-whatsapp"></i>
        <i class="fa-brands fa-pinterest"></i>
      </div>
    </div>
  </div>
  <hr>
  <br>
  <p class="copyright">Easy Tutorials @ 2025 - All Right Reserved</p>
</footer>

<style>
  *{
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family: "Poppins", sans-serif;
	  }
    footer{
      grid-area: footer;
      width: 99.1%;
      bottom: 0;
      background: #004aad;
      color: #fff;
      padding: 40px 0 30px;
      font-size: 14px;
      line-height: 20px;
      margin-left: 11px;
    }
    .row{
     width: 85%;
     margin: auto;
     display: flex;
     flex-wrap: wrap;
     align-items: flex-start;
     justify-content: space-between;
    }

    .col{
      flex-basis: 25%;
      padding: 10px;
    }

    .col:nth-child(2) .col:nth-child(3){
      flex-basis: 15%;
    }

    .logo{
      width: 80px;
      margin-bottom: 30px;
    }

    .col h3{
      width: fit-content;
      margin-bottom: 40px;
      position: relative;
    }

    .email-id{
      width: fit-content;
      border-bottom: 1px solid #ccc;
      margin: 20px 0;
    }

    ul li{
      list-style: none;
      margin-bottom: 12px;

    }

    ul li a{
      text-decoration: none;
      color: #fff;
    }

    form{
    padding-bottom: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2px solid #ccc;
    margin-bottom: 50px;
    }

    form .fa-solid{
      font-size: 18px;
      margin-right: 10px;
    }

    form input{
      width: 100%;
      background: transparent;
      color: #ccc;
      border: 0;
      outline: none;
    }

    form button{
      background: transparent;
      border: 0;
      outline: none;
      cursor: pointer;
    }

    form button .fa-solid{
      font-size: 16px;
      color: #ccc;
    }

    .social-icons .fa-brands{
      width: 40px;
      height: 40px;
      border-radius: 50%;
      text-align: center;
      line-height: 40px;
      font-size: 20px;
      color: #000;
      background: #fff;
      margin-right: 15px;
      cursor: pointer;
    }
    .hr{
      width: 90%;
      border: 0;
      border-bottom: 1px solid #ccc;
      margin: 20px auto;
    }

    .copyright{
      text-align: center;
      font-size: 20px;
    }

    .sidebar.collapsed ~ footer {
      margin-left: -114px;
      width: 108.5%; /* When sidebar is collapsed */

    }
</style>
