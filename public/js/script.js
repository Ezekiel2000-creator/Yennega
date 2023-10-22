const navBtn = document.querySelector('.header__collapse--btn');
const nav = document.querySelector('.nav');
const navWrapper = document.querySelector('.navWrapper');
const navClose = document.querySelector('.nav__close');

// Nav
const showOrder = document.querySelector('.nav__showOrders');
const showProducts = document.querySelector('.nav__showProducts');
const navOrdersList = document.querySelector('.nav__orders--items');
const navProductsList = document.querySelector('.nav__products--items');

// Start nav Toggle
navBtn.addEventListener('click', () => {
    console.log(`object`);
    nav.classList.toggle('show');
    // navWrapper.classList.toggle('show-item');
});

navClose.addEventListener('click', (e) => {
    console.log(e.target.parentElement);
    nav.classList.remove('show');
    // navWrapper.classList.remove('show-item');
});

showOrder.addEventListener('click', () => {
    navOrdersList.classList.toggle('show');
});
showProducts.addEventListener('click', () => {
    navProductsList.classList.toggle('show');
});

// End nav Toggle

// Start Toggle Header profile
const toggleProfileNav = document.querySelector('.header__profile');
const showProfileNav = document.querySelector('.header__profile__name--nav');
toggleProfileNav.addEventListener('click', () => {
    showProfileNav.classList.toggle('show');
});
// End Toggle Header profile

// Start Toggle orders filter
const showOrderFilter = document.querySelector(
    '.orders__table--filter--listWrapper'
);
const toggleShowOrderFilter = document.querySelector(
    '.orders__table--filter--collapseBtn'
);
toggleShowOrderFilter.addEventListener('click', () => {
    showOrderFilter.classList.toggle('show');
    console.log(`filter orders`);
});
// End Toggle orders filter

// Start Toggle abandoned orders filter
const showAbandonedOrderFilter = document.querySelector(
    '.abandoned__table--filter--listWrapper'
);
const toggleShowAbandonedOrderFilter = document.querySelector(
    '.abandoned__table--filter--collapseBtn'
);
toggleShowAbandonedOrderFilter.addEventListener('click', () => {
    console.log(`filter abandoned orders`);
    showAbandonedOrderFilter.classList.toggle('show');
});
// End Toggle abandoned orders filter

// Start Add/Edit tracking button - Single order page
const showAddEditTrackingModal = document.querySelector(
    '.singleOrder__main--modal--addEditTracking'
);
const toggleShowAddEditTrackingModal = document.querySelector(
    '.singleOrder__main--modal--addEditTrackingBtn'
);
const closeShowAddEditTrackingModal = document.querySelectorAll(
    '.singleOrder__main--modal--addEditTracking--closeBtn'
);

toggleShowAddEditTrackingModal.addEventListener('click', () => {
    showAddEditTrackingModal.classList.toggle('show');
});

closeShowAddEditTrackingModal.forEach((btn) => {
    btn.addEventListener('click', () => {
        showAddEditTrackingModal.classList.toggle('show');
    });
});

// End Add/Edit tracking button - Single order page

// Start Capture Payment Btn - Single Order Page
const toggleShowCapturePaymentModal = document.querySelector(
    '.singleOrder__main--card--paymentDetails--captureBtn'
);
const closeShowCapturePaymentModal = document.querySelectorAll(
    '.singleOrder__main--modal--close--capturePayment'
);
const showCapturePaymentModal = document.querySelector(
    '.singleOrder__main--modal--capturePayment'
);

toggleShowCapturePaymentModal.addEventListener('click', () => {
    showCapturePaymentModal.classList.toggle('show');
});
closeShowCapturePaymentModal.forEach((btn) => {
    btn.addEventListener('click', () => {
        showCapturePaymentModal.classList.toggle('show');
    });
});

// End Capture Payment Btn

// Variants Input Tags

const variantOptionInput = document.querySelectorAll(
    '.products__create__main--variants--col--optionValues--input'
);
const variantOptionTagsWrapper = document.querySelector(
    '.products__create__main--variants--col--optionValues--wrapper'
);

// variantOptionInput.addEventListener('focus', () => {
//     variantOptionTagsWrapper.style.border = '2px solid #5463c1';
// });
// variantOptionInput.addEventListener('blur', () => {
//     variantOptionTagsWrapper.style.border = '';
// });

variantOptionInput.forEach((input) => {
    input.addEventListener('focus', (e) => {
        e.target.parentElement.parentElement.style.border = '2px solid #5463c1';
    });
});

variantOptionInput.forEach((input) => {
    input.addEventListener('blur', (e) => {
        e.target.parentElement.parentElement.style.border = '';
    });
});

// Menu links
// const menuLinks = document.querySelectorAll('.menu-link');

// // Sections 
// const sections = document.querySelectorAll('.section');

// menuLinks.forEach(link => {
//   link.addEventListener('click', e => {
//     // Annuler le comportement par défaut
//     e.preventDefault();

//     // Récupérer la valeur du data-attribute
//     const sectionToShow = link.dataset.section;

//     // Masquer toutes les sections
//     sections.forEach(section => {
//       if (!section.classList.contains('hide-item')) {
//         section.classList.add('hide-item');
//       }
//     });

//     // Sélectionner tous les éléments correspondants
//     const matchingSections = document.querySelectorAll(`[data-section="${sectionToShow}"]`);

//     // Vérifier s'il y a au moins deux éléments correspondants
//     if (matchingSections.length >= 2) {
//       // Sélectionner le deuxième élément correspondant et supprimer la classe 'hide-item'
//       console.log("sectionToShow",matchingSections[1].classList)
//       matchingSections[1].classList.remove('hide-item');
//     }
//   });
// });

// // Sélectionnez le lien avec la classe "table--items--col1"
// const link = document.querySelector('.table--items--col1');
// const new_product = document.querySelector('.new_product');
// const all_products = document.querySelector('.products');

// // Sélectionnez l'élément suivant avec la classe "singleOrder"
// const singleOrder = document.querySelector('.singleOrder');

// const orders = document.querySelector('.orders');

// const create_product = document.querySelector('.products__create');
// const products_list = document.querySelector('.products__list');

// // Ajoutez un écouteur d'événement de clic au lien
// link.addEventListener('click', e => {
//   e.preventDefault();
//   console.log(orders);
//   orders.classList.add('hide-item');
//   // Retirez la classe "hide-item" de l'élément suivant "singleOrder"
//   singleOrder.classList.remove('hide-item');
// });

// // new_product.addEventListener('click',e =>{
// //     e.preventDefault();
// //     console.log(all_products.classList);
// //     products_list.classList.add('hide-item');
// //     create_product.classList.remove('hide-item');
// // });

// Sélectionnez la div à écouter par sa classe
const retour = document.querySelectorAll('.breadcramb');
console.log(retour);

function submitForms() {
    document.getElementById('form_5').submit(); // Soumet le premier formulaire
   
  }
