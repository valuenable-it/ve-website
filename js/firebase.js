// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

console.log(firebase.firestore);
// Listen for form submit
document.getElementById('userForm').addEventListener('submit', submitForm);

// Submit form
function submitForm(e) {
    e.preventDefault();

    // Get values
    var name = getInputVal('conatct-name');
    var company = getInputVal('companyname');
    var email = getInputVal('contact-email');
    var phone = getInputVal('contact-mobile');
    let city = getInputVal("position");
    let description = getInputVal("description");
    console.log(name);

    // Save message
    // saveMessage(name, company, email, phone, message);

    // // Show alert
    // document.querySelector('.alert').style.display = 'block';

    // // Hide alert after 3 seconds
    // setTimeout(function () {
    //     document.querySelector('.alert').style.display = 'none';
    // }, 3000);

    // Clear form
    document.getElementById('userForm').reset();
}

// Function to get get form values
function getInputVal(id) {
    console.log(id);
    console.log(document.getElementById(id).value);
    return document.getElementById(id).value;
}

// Save message to firebase
function saveMessage(name, company, email, phone, message) {
    var newMessageRef = messagesRef.push();
    newMessageRef.set({
        name: name,
        company: company,
        email: email,
        phone: phone,
        message: message
    });
}