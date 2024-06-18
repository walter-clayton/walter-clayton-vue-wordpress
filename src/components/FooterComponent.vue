<template>
  <footer class="footer">
    <div class="container">
      <div class="social-links">
        <a href="https://github.com/walter-clayton/" target="_blank" rel="noopener noreferrer">
          <i class="fab fa-github"></i>
        </a>
        <a href="https://www.linkedin.com/in/walter-clayton-2b50b4191/" target="_blank" rel="noopener noreferrer">
          <i class="fab fa-linkedin"></i>
        </a>
      </div>
      <hr />
      <span class="copyright"> &copy; 2024 Walter Clayton, All Rights Reserved</span>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: transparent;
  padding: 20px 0;
  text-align: center;
}

.container {
  max-width: 1200px;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.social-links {
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
}

.social-links a {
  color: #6c757d;
  font-size: 2em;
  transition: color 0.3s;
}

.social-links a:hover {
  color: #343a40;
}

hr {
  width: 100%;
  border: 0;
  border-top: 1px solid #dee2e6;
  margin: 20px 0;
}

.copyright {
  color: #6c757d;
}
</style>
