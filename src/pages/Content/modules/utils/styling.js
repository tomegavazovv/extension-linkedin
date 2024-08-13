const styling = `

.sidebar {
  width: 400px;
  height: 100vh;
  position: fixed;
  left: -400px; /* Start hidden to the left */
  top: 0;
  background-color: #ffffff;
  transition: left 0.3s ease;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.sidebar-container {
  padding: 50px; padding-top: 20px;
}

.sidebar.open {
  left: 0; /* Slide in */
}

.toggle-button {
  position: fixed;
  top: 0px;
  left: 0px;
  background-color: #0966C2;
  z-index: 1001;
  height: 51px;
  border: none;
  width: 50px;
  border-bottom-right-radius: 7px;
  transition: left 0.3s ease;
}

.engaged-post {
  background-color: #edf9ed !important; 
}

.toggle-button:hover{
  cursor:pointer;
}

.open-btn {
  left: 400px;
}

.dropdown-container {
  margin-top: 50px;
}

.dropdown-label {
  display: block;
  margin-bottom: 22px;  
  font-size: 20px; 
  font-weight:600;
  color: #333;
}

.dropdown {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f8f8f8;
  color: #333;
}

.radio-group{
  margin-top: 35px;
}

.radio-label {
  display: block;
  font-size: 20px; 
  font-weight:600;
  color: #333;
  margin-bottom: 22px;
}

.radio-option {
  display: flex; 
  align-items:center;
  font-size: 13px;
  color: #666666;
  margin-bottom: 8px;
}

.radio-option input {
   margin: 0px; 
   margin-right: 12px; 
   margin-left:7px;
}

.first-two {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.radio-option input[type='radio'] {
  transform: scale(1.65);
}

.engaged-checkbox{  
  margin-left: 3px;
  display: flex;
  align-items: center;
}

.engaged-checkbox input {
  margin-right:5px;
  transform: scale(0.9);
}


.divider{
  width: 100%; 
  justify-self: center; 
  align-self: center;
  height: 3px; 
  margin-top: 45px; 
  border-radius: 20px; 
  margin-bottom: 40px;
  background-color: #e8e8e8;
}

.dropdown.selected {
  background-color: #0B66C2;
  font-weight: 600;
  color: white;
}

.dropdown option {
  color: black; 
}

.dropdown option[value=""] {
  color: gray; 
}

.button-container{
  width: 100%; 
  display: flex; 
  justify-content:center; 
  margin-top: 30px;
} 

.submit-button{
  border: none; 
  background-color: #0b66c2; 
  padding: 10px 20px; 
  color: white; 
  font-weight: 600; 
  border-radius: 20px; 
  font-size: 16px;   
  transition: background-color 0.3s ease;
}

.submit-button:hover{
  cursor: pointer;
}

.add-user-button:hover{
  cursor: pointer;
}

.add-user-button:disabled{
  background-color: #cccccc !important; 
  cursor: not-allowed !important;
}

.submit-button:disabled {
  background-color: #cccccc; 
  cursor: not-allowed !important;
} 

.add-button:disabled{
  background-color: #cccccc !important; 
  cursor: not-allowed !important;
}

.add-button:hover{
  cursor: pointer;
}

.header-container{
  margin: 0px; 
  margin-bottom: 20px; 
  display: flex; 
  width: 100%; 
  justify-content: space-between; 
  align-items: center;
} 

.manage-lists{
  display: flex; 
  align-items: center; 
  padding: 0px; 
  margin-top: 50px; 
  justify-content: space-between;
  transition: scale 0.3s ease;
}

.manage-lists:hover{
  cursor: pointer;
  transform: scale(1.005);
}

.hidden{
  display: none !important;
}

.manage-lists-text{
  font-size: 18px; 
  font-weight: 500; 
  margin: 0px; 
  color: #66666; 
  text-decoration: underline;
}

.loader {
	width: 50px;
	aspect-ratio: 1;
	border-radius: 50%;
	background: radial-gradient(farthest-side, #0b66c2 94%, #0000) top/8px 8px no-repeat,
		conic-gradient(#0000 30%, #0b66c2);
	-webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 8px), #000 0);
	animation: l13 1s infinite linear;
}

@keyframes l13 {
	100% {
		transform: rotate(1turn);
	}
}

`;

export default styling;
