document.addEventListener('DOMContentLoaded', function() {
    console.log("nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn");
    const deleteButtons = document.querySelectorAll('a[href^="delete/"]');
    console.log("nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn",deleteButtons);
    const confirmModal = document.getElementById('confirmModal');
    console.log("nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn",confirmModal);
    const confirmDelete = document.getElementById('confirmDelete');
    const cancelDelete = document.getElementById('cancelDelete');
    let deleteUrl;
  
    deleteButtons.forEach(function(button) {
      button.addEventListener('click', function(event) {
        event.preventDefault();
        deleteUrl = this.getAttribute('href');
        confirmModal.style.display = 'block';
      });
    });
  
    confirmDelete.addEventListener('click', function() {
      window.location.href = deleteUrl;
    });
  
    cancelDelete.addEventListener('click', function() {
      confirmModal.style.display = 'none';
    });
    window.addEventListener('click', (event) => {
        if(event.target === confirmModal) {
            confirmModal.style.display = 'none'; 
        }
      });
    confirmModal.style.display = 'none';
  });