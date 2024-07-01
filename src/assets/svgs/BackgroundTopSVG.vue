<template>
  <div class="svg-container">
    <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 1512 410" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        preserveAspectRatio="xMinYMin slice">
      <path d="M-7.28638 0.600586L1512 0.600586V333.907C1512 333.907 882.578 121.851 459.27 197.816C35.9616 273.781 -7.28638 409.555 -7.28638 409.555V0.600586Z" fill="url(#paint0_linear_712_1021)"/>
      <defs>
        <linearGradient id="paint0_linear_712_1021" x1="752.357" y1="-69.2411" x2="752.357" y2="651.211" gradientUnits="userSpaceOnUse">
          <stop offset="0.9999" stop-color="#D3C9BB"/>
          <stop offset="1" stop-color="#D3C9BB" stop-opacity="0"/>
        </linearGradient>
      </defs>
    </svg>
  </div>
</template>
<style scoped>
.svg-container {
  margin-top: -10px;
  width: 100vw; /* Full viewport width */
  height: auto; /* Adjust height based on the aspect ratio */
}
svg {
  display: block; /* Removes unwanted space below the SVG */
}
@media only screen and (max-width: 768px) {
  svg {
    height: 50%;
  }
}
</style>