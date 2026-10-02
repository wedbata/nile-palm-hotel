/**
 * Nile Palm Hotel, Juba - Vanilla JavaScript
 * Lightweight, zero-dependency, optimized for fast mobile rendering.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- 1. CONSTANTS & CONFIGURATION ---
  const HOTEL_WHATSAPP_NUMBER = '211920000123';
  const ROOM_DATA = {
    standard: {
      name: 'Standard Queen Room',
      price: 110,
      specs: '24 m² • Queen Bed • Max 1-2 Guests'
    },
    deluxe: {
      name: 'Deluxe King Room',
      price: 160,
      specs: '36 m² • King Bed • Max 2 Guests'
    },
    executive: {
      name: 'Executive Nile Suite',
      price: 240,
      specs: '58 m² • Master King Suite • Max 3 Guests'
    }
  };

  // --- 2. DOM ELEMENTS ---
  const header = document.getElementById('main-header');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavClose = document.getElementById('mobile-nav-close');
  const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav__item');

  // Hero Quick Check
  const heroQuickForm = document.getElementById('hero-quick-form');
  const heroCheckin = document.getElementById('hero-checkin');
  const heroCheckout = document.getElementById('hero-checkout');
  const heroRoomType = document.getElementById('hero-room-type');
  const heroGuests = document.getElementById('hero-guests');

  // Main Booking Form
  const reservationForm = document.getElementById('reservation-form');
  const guestName = document.getElementById('guest-name');
  const guestEmail = document.getElementById('guest-email');
  const guestPhone = document.getElementById('guest-phone');
  const guestOrg = document.getElementById('guest-org');
  const checkinDate = document.getElementById('checkin-date');
  const checkoutDate = document.getElementById('checkout-date');
  const roomSelection = document.getElementById('room-selection');
  const guestCount = document.getElementById('guest-count');
  const airportShuttle = document.getElementById('airport-shuttle');
  const specialRequests = document.getElementById('special-requests');
  const btnWhatsappBook = document.getElementById('btn-whatsapp-book');

  // Estimate Box Elements
  const estRoomName = document.getElementById('est-room-name');
  const estNights = document.getElementById('est-nights');
  const estTotalPrice = document.getElementById('est-total-price');

  // Room Card Buttons
  const roomBookButtons = document.querySelectorAll('.btn-book-room');

  // Modals
  const confirmationModal = document.getElementById('confirmation-modal');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalDoneBtn = document.getElementById('modal-done-btn');
  const modalPrintBtn = document.getElementById('modal-print-btn');
  const modalWhatsappSend = document.getElementById('modal-whatsapp-send');

  const summaryRef = document.getElementById('summary-ref');
  const summaryName = document.getElementById('summary-name');
  const summaryRoom = document.getElementById('summary-room');
  const summaryDates = document.getElementById('summary-dates');
  const summaryTotal = document.getElementById('summary-total');
  const summaryShuttle = document.getElementById('summary-shuttle');

  // Printable Folio Elements (UN/NGO Expense Reporting)
  const printRef = document.getElementById('print-ref');
  const printDate = document.getElementById('print-date');
  const printGuestName = document.getElementById('print-guest-name');
  const printGuestOrg = document.getElementById('print-guest-org');
  const printGuestEmail = document.getElementById('print-guest-email');
  const printGuestPhone = document.getElementById('print-guest-phone');
  const printRoomName = document.getElementById('print-room-name');
  const printCheckin = document.getElementById('print-checkin');
  const printCheckout = document.getElementById('print-checkout');
  const printNights = document.getElementById('print-nights');
  const printTableRoom = document.getElementById('print-table-room');
  const printTableNights = document.getElementById('print-table-nights');
  const printTableRate = document.getElementById('print-table-rate');
  const printTableSubtotal = document.getElementById('print-table-subtotal');
  const printTableTotal = document.getElementById('print-table-total');
  const printTableShuttleTitle = document.getElementById('print-table-shuttle-title');
  const printTableShuttleDesc = document.getElementById('print-table-shuttle-desc');

  // Language Modal
  const langBtn = document.getElementById('lang-btn');
  const langModal = document.getElementById('lang-modal');
  const langOverlay = document.getElementById('lang-overlay');
  const langCloseBtn = document.getElementById('lang-close-btn');
  const langOkBtn = document.getElementById('lang-ok-btn');

  // FAQ Accordion
  const faqNodes = document.querySelectorAll('.faq-node');

  // Toast Container
  const toastContainer = document.getElementById('toast-container');


  // --- 3. DATE INITIALIZATION & VALIDATION HELPERS ---
  const formatDateToISO = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const initDates = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayISO = formatDateToISO(today);
    const tomorrowISO = formatDateToISO(tomorrow);

    // Hero Form
    if (heroCheckin) {
      heroCheckin.min = todayISO;
      heroCheckin.value = todayISO;
    }
    if (heroCheckout) {
      heroCheckout.min = tomorrowISO;
      heroCheckout.value = tomorrowISO;
    }

    // Reservation Form
    if (checkinDate) {
      checkinDate.min = todayISO;
      checkinDate.value = todayISO;
    }
    if (checkoutDate) {
      checkoutDate.min = tomorrowISO;
      checkoutDate.value = tomorrowISO;
    }
  };

  initDates();

  // Keep check-out date constrained to at least 1 day after check-in
  const handleDateChange = (inInput, outInput) => {
    if (!inInput || !outInput) return;
    const selectedIn = new Date(inInput.value);
    if (!isNaN(selectedIn.getTime())) {
      const nextDay = new Date(selectedIn);
      nextDay.setDate(nextDay.getDate() + 1);
      const nextDayISO = formatDateToISO(nextDay);
      outInput.min = nextDayISO;

      const currentOut = new Date(outInput.value);
      if (isNaN(currentOut.getTime()) || currentOut <= selectedIn) {
        outInput.value = nextDayISO;

        // Dynamic UI feedback animation
        outInput.classList.remove('date-auto-updated');
        void outInput.offsetWidth; // Force reflow to restart CSS animation
        outInput.classList.add('date-auto-updated');

        showToast(`Check-out adjusted to ${nextDayISO} (minimum 1-night stay).`);
      }
    }
    updateEstimate();
  };

  if (checkinDate && checkoutDate) {
    checkinDate.addEventListener('change', () => handleDateChange(checkinDate, checkoutDate));
    checkoutDate.addEventListener('change', updateEstimate);
  }

  if (heroCheckin && heroCheckout) {
    heroCheckin.addEventListener('change', () => handleDateChange(heroCheckin, heroCheckout));
  }


  // --- 4. REAL-TIME BOOKING ESTIMATE CALCULATOR ---
  function updateEstimate() {
    if (!roomSelection || !checkinDate || !checkoutDate) return;

    const selectedType = roomSelection.value || 'deluxe';
    const roomInfo = ROOM_DATA[selectedType] || ROOM_DATA.deluxe;

    const inDate = new Date(checkinDate.value);
    const outDate = new Date(checkoutDate.value);

    let nights = 1;
    if (!isNaN(inDate.getTime()) && !isNaN(outDate.getTime()) && outDate > inDate) {
      const diffTime = Math.abs(outDate - inDate);
      nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    }

    const totalUSD = nights * roomInfo.price;

    if (estRoomName) {
      estRoomName.textContent = `${roomInfo.name} ($${roomInfo.price}/night)`;
    }
    if (estNights) {
      estNights.textContent = `${nights} ${nights === 1 ? 'Night' : 'Nights'}`;
    }
    if (estTotalPrice) {
      estTotalPrice.textContent = `$${totalUSD} USD`;
    }
  }

  if (roomSelection) {
    roomSelection.addEventListener('change', updateEstimate);
  }
  updateEstimate();


  // --- 5. STICKY HEADER & ACTIVE NAVIGATION OBSERVER ---
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }, { passive: true });

  const sections = document.querySelectorAll('section[id], footer[id]');
  const navDesktopLinks = document.querySelectorAll('.nav-desktop .nav-link');

  const highlightNavOnScroll = () => {
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navDesktopLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });


  // --- 6. MOBILE NAVIGATION DRAWER ---
  const openMobileNav = () => {
    mobileNav.setAttribute('aria-hidden', 'false');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileNav = () => {
    mobileNav.setAttribute('aria-hidden', 'true');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openMobileNav);
  if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileNav);
  if (mobileNavOverlay) mobileNavOverlay.addEventListener('click', closeMobileNav);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        closeMobileNav();
      }
    });
  });


  // --- 7. ROOM CARDS BOOKING CONNECTOR ---
  roomBookButtons.forEach(button => {
    button.addEventListener('click', () => {
      const roomType = button.getAttribute('data-room-type');
      if (roomSelection && roomType) {
        roomSelection.value = roomType;
        updateEstimate();
      }

      const bookingSection = document.getElementById('booking-section');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });

        setTimeout(() => {
          if (guestName) guestName.focus();
        }, 500);

        showToast(`Selected: ${ROOM_DATA[roomType]?.name || 'Room'}. Complete your reservation details.`);
      }
    });
  });


  // --- 8. HERO QUICK-FORM SYNC ---
  if (heroQuickForm) {
    heroQuickForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (checkinDate && heroCheckin) checkinDate.value = heroCheckin.value;
      if (checkoutDate && heroCheckout) checkoutDate.value = heroCheckout.value;
      if (roomSelection && heroRoomType) roomSelection.value = heroRoomType.value;
      if (guestCount && heroGuests) guestCount.value = heroGuests.value;

      updateEstimate();

      const bookingSection = document.getElementById('booking-section');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          if (guestName) guestName.focus();
        }, 500);
      }
    });
  }


  // --- 9. FORM VALIDATION & CONFIRMATION MODAL ---
  const validateField = (input, validationFn) => {
    const fieldWrapper = input.closest('.field');
    const isValid = validationFn(input.value.trim());

    if (!isValid) {
      fieldWrapper.classList.add('has-error');
    } else {
      fieldWrapper.classList.remove('has-error');
    }
    return isValid;
  };

  const isNotEmpty = (val) => val.length > 0;
  const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const isValidPhone = (val) => val.length >= 7;

  if (reservationForm) {
    reservationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = validateField(guestName, isNotEmpty);
      const isEmailValid = validateField(guestEmail, isValidEmail);
      const isPhoneValid = validateField(guestPhone, isValidPhone);
      const isCheckinValid = validateField(checkinDate, isNotEmpty);
      const isCheckoutValid = validateField(checkoutDate, isNotEmpty);

      if (!isNameValid || !isEmailValid || !isPhoneValid || !isCheckinValid || !isCheckoutValid) {
        showToast('Please check the required fields highlighted in red.');
        return;
      }

      // Generate reference ID
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const bookingRef = `NPH-${new Date().getFullYear()}-${randomNum}`;

      const selectedType = roomSelection.value;
      const roomInfo = ROOM_DATA[selectedType] || ROOM_DATA.deluxe;

      const inDate = new Date(checkinDate.value);
      const outDate = new Date(checkoutDate.value);
      const diffDays = Math.ceil(Math.abs(outDate - inDate) / (1000 * 60 * 60 * 24)) || 1;
      const totalAmount = diffDays * roomInfo.price;

      // Fill summary modal
      if (summaryRef) summaryRef.textContent = bookingRef;
      if (summaryName) summaryName.textContent = guestName.value.trim();
      if (summaryRoom) summaryRoom.textContent = `${roomInfo.name} ($${roomInfo.price}/night)`;
      if (summaryDates) summaryDates.textContent = `${checkinDate.value} to ${checkoutDate.value} (${diffDays} ${diffDays === 1 ? 'night' : 'nights'})`;
      if (summaryTotal) summaryTotal.textContent = `$${totalAmount} USD`;
      if (summaryShuttle) {
        summaryShuttle.textContent = airportShuttle.checked ? 'Complimentary JUB Airport Pickup Included' : 'Not Requested';
      }

      // Populate Printable Folio (for UN/NGO Expense Settlement)
      if (printRef) printRef.textContent = bookingRef;
      if (printDate) printDate.textContent = formatDateToISO(new Date());
      if (printGuestName) printGuestName.textContent = guestName.value.trim() || 'Valued Guest';
      if (printGuestOrg) printGuestOrg.textContent = guestOrg.value.trim() || 'Independent / Direct Reservation';
      if (printGuestEmail) printGuestEmail.textContent = guestEmail.value.trim() || '-';
      if (printGuestPhone) printGuestPhone.textContent = guestPhone.value.trim() || '-';
      if (printRoomName) printRoomName.textContent = roomInfo.name;
      if (printCheckin) printCheckin.textContent = checkinDate.value;
      if (printCheckout) printCheckout.textContent = checkoutDate.value;
      if (printNights) printNights.textContent = `${diffDays} ${diffDays === 1 ? 'Night' : 'Nights'}`;

      if (printTableRoom) printTableRoom.textContent = `${roomInfo.name} Accommodation`;
      if (printTableNights) printTableNights.textContent = `${diffDays} ${diffDays === 1 ? 'Night' : 'Nights'}`;
      if (printTableRate) printTableRate.textContent = `$${roomInfo.price.toFixed(2)}`;
      if (printTableSubtotal) printTableSubtotal.textContent = `$${totalAmount.toFixed(2)} USD`;
      if (printTableTotal) printTableTotal.textContent = `$${totalAmount.toFixed(2)} USD`;

      if (printTableShuttleTitle) {
        printTableShuttleTitle.textContent = airportShuttle.checked
          ? 'Juba International Airport (JUB) 4WD Transfer'
          : 'Juba Airport Transfer (Not Requested)';
      }
      if (printTableShuttleDesc) {
        printTableShuttleDesc.textContent = airportShuttle.checked
          ? 'Complimentary meet & greet by official hotel driver at terminal arrivals'
          : 'Can be requested at front desk upon arrival if flight details change';
      }

      // Prepare WhatsApp message URL for modal button
      const whatsappMsg = buildWhatsAppMessage({
        ref: bookingRef,
        name: guestName.value.trim(),
        email: guestEmail.value.trim(),
        phone: guestPhone.value.trim(),
        org: guestOrg.value.trim(),
        room: roomInfo.name,
        checkin: checkinDate.value,
        checkout: checkoutDate.value,
        nights: diffDays,
        total: totalAmount,
        shuttle: airportShuttle.checked,
        notes: specialRequests.value.trim()
      });

      if (modalWhatsappSend) {
        modalWhatsappSend.href = `https://wa.me/${HOTEL_WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMsg)}`;
      }

      // Show modal
      openModal(confirmationModal);
    });
  }


  // --- 10. WHATSAPP DIRECT RESERVATION BUTTON ---
  const buildWhatsAppMessage = (data) => {
    return `*NILE PALM HOTEL - RESERVATION INQUIRY*\n` +
      `-----------------------------------------\n` +
      `*Booking Ref:* ${data.ref || 'NEW-INQUIRY'}\n` +
      `*Guest Name:* ${data.name}\n` +
      `*Phone/WhatsApp:* ${data.phone}\n` +
      `*Email:* ${data.email}\n` +
      (data.org ? `*Organization:* ${data.org}\n` : '') +
      `*Room Category:* ${data.room}\n` +
      `*Check-in Date:* ${data.checkin}\n` +
      `*Check-out Date:* ${data.checkout} (${data.nights} nights)\n` +
      `*Estimated Total:* $${data.total} USD\n` +
      `*Airport Transfer:* ${data.shuttle ? 'YES (Flight details to follow)' : 'No'}\n` +
      (data.notes ? `*Special Requests:* ${data.notes}\n` : '') +
      `-----------------------------------------\n` +
      `_Sent from Nile Palm Hotel Website (Hai Amarat, Juba)_`;
  };

  if (btnWhatsappBook) {
    btnWhatsappBook.addEventListener('click', () => {
      const name = guestName.value.trim() || 'Guest';
      const email = guestEmail.value.trim() || 'Not specified';
      const phone = guestPhone.value.trim() || 'Not specified';
      const org = guestOrg.value.trim();
      const selectedType = roomSelection.value;
      const roomInfo = ROOM_DATA[selectedType] || ROOM_DATA.deluxe;

      const inDate = new Date(checkinDate.value);
      const outDate = new Date(checkoutDate.value);
      const diffDays = Math.ceil(Math.abs(outDate - inDate) / (1000 * 60 * 60 * 24)) || 1;
      const totalAmount = diffDays * roomInfo.price;

      const msg = buildWhatsAppMessage({
        ref: 'DIRECT-WHATSAPP',
        name,
        email,
        phone,
        org,
        room: roomInfo.name,
        checkin: checkinDate.value,
        checkout: checkoutDate.value,
        nights: diffDays,
        total: totalAmount,
        shuttle: airportShuttle.checked,
        notes: specialRequests.value.trim()
      });

      const url = `https://wa.me/${HOTEL_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank');
    });
  }


  // --- 11. FAQ ACCORDION ---
  faqNodes.forEach(item => {
    const triggerBtn = item.querySelector('.faq-trigger');
    const drawer = item.querySelector('.faq-drawer');

    if (triggerBtn && drawer) {
      triggerBtn.addEventListener('click', () => {
        const isExpanded = triggerBtn.getAttribute('aria-expanded') === 'true';

        // Close all other nodes
        faqNodes.forEach(otherNode => {
          if (otherNode !== item) {
            otherNode.classList.remove('active');
            const otherBtn = otherNode.querySelector('.faq-trigger');
            const otherDrawer = otherNode.querySelector('.faq-drawer');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            if (otherDrawer) otherDrawer.style.maxHeight = null;
          }
        });

        if (!isExpanded) {
          item.classList.add('active');
          triggerBtn.setAttribute('aria-expanded', 'true');
          drawer.style.maxHeight = drawer.scrollHeight + 'px';
        } else {
          item.classList.remove('active');
          triggerBtn.setAttribute('aria-expanded', 'false');
          drawer.style.maxHeight = null;
        }
      });
    }
  });


  // --- 12. MODAL CONTROLS & LANGUAGE DIALOG ---
  function openModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add('active');
    modalEl.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove('active');
    modalEl.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Confirmation Modal listeners
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', () => closeModal(confirmationModal));
  if (modalDoneBtn) modalDoneBtn.addEventListener('click', () => closeModal(confirmationModal));
  if (modalOverlay) modalOverlay.addEventListener('click', () => closeModal(confirmationModal));
  if (modalPrintBtn) {
    modalPrintBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Language Modal listeners
  if (langBtn) {
    langBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(langModal);
    });
  }
  if (langCloseBtn) langCloseBtn.addEventListener('click', () => closeModal(langModal));
  if (langOkBtn) langOkBtn.addEventListener('click', () => closeModal(langModal));
  if (langOverlay) langOverlay.addEventListener('click', () => closeModal(langModal));

  // ESC key to close any active modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(confirmationModal);
      closeModal(langModal);
      closeMobileNav();
    }
  });


  // --- 13. TOAST NOTIFICATION UTILITY ---
  function showToast(message) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>ℹ️</span> <div>${message}</div>`;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

});
