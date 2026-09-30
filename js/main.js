"use strict";

const initMobileMenu = () => {
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".primary-nav");
  const mobileViewport = window.matchMedia("(max-width: 620px)");

  if (!menuButton || !navigation) return;

  const setMenuOpen = (isOpen) => {
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"
    );
    navigation.classList.toggle("is-open", isOpen);
    navigation.inert = mobileViewport.matches && !isOpen;
  };

  setMenuOpen(false);

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    setMenuOpen(!isOpen);
  });

  navigation.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (link && mobileViewport.matches) setMenuOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false);
      menuButton.focus();
    }
  });

  mobileViewport.addEventListener("change", () => setMenuOpen(false));
};

const initHeaderState = () => {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 16);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
};

const initBackToTop = () => {
  const backToTop = document.querySelector('.back-top[href="#inicio"]');
  if (!backToTop) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  backToTop.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: reduceMotion.matches ? "auto" : "smooth",
    });
  });
};

const initActiveNavigation = () => {
  const navigation = document.querySelector(".primary-nav");
  if (!navigation || !("IntersectionObserver" in window)) return;

  const links = [...navigation.querySelectorAll('a[href^="#"]')];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleSections = entries
        .filter((entry) => entry.isIntersecting)
        .sort((first, second) => first.boundingClientRect.top - second.boundingClientRect.top);

      if (visibleSections.length === 0) return;

      const activeId = `#${visibleSections[0].target.id}`;
      links.forEach((link) => {
        const isActive = link.getAttribute("href") === activeId;
        link.classList.toggle("is-active", isActive);
        if (isActive) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
};

const initProjectFilters = () => {
  const filters = [...document.querySelectorAll(".project-filter")];
  const projects = [...document.querySelectorAll(".project-card[data-category]")];
  if (filters.length === 0 || projects.length === 0) return;

  const pendingHides = new WeakMap();
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const setProjectVisibility = (project, isVisible) => {
    window.clearTimeout(pendingHides.get(project));

    if (isVisible) {
      project.hidden = false;
      project.inert = false;
      project.removeAttribute("aria-hidden");
      window.requestAnimationFrame(() => {
        if (!project.inert) project.classList.remove("is-filtered-out");
      });
      return;
    }

    project.classList.add("is-filtered-out");
    project.inert = true;
    project.setAttribute("aria-hidden", "true");
    const delay = reduceMotion.matches ? 0 : 200;
    const hideTimer = window.setTimeout(() => {
      if (project.inert) project.hidden = true;
    }, delay);
    pendingHides.set(project, hideTimer);
  };

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      const category = filter.dataset.filter;

      filters.forEach((button) => {
        button.setAttribute("aria-pressed", String(button === filter));
      });

      projects.forEach((project) => {
        setProjectVisibility(
          project,
          category === "all" || project.dataset.category === category
        );
      });
    });
  });
};

const initProjectDialog = () => {
  const dialog = document.querySelector("#project-dialog");
  const closeButton = dialog?.querySelector(".project-dialog-close");
  const openButtons = [...document.querySelectorAll(".project-open[data-project]")];
  if (!dialog || !closeButton || openButtons.length === 0) return;

  const projectDetails = {
    "casa-norte": {
      name: "Casa Norte",
      category: "E-commerce · Diseño web",
      description: "Una tienda online cálida y simple para descubrir objetos pensados para vivir mejor.",
      detail: "Organizamos el catálogo y el recorrido de compra para que cada producto encuentre su lugar y sea fácil de elegir.",
      technologies: ["HTML", "CSS", "JavaScript"],
    },
    "bosque-estudio": {
      name: "Bosque Estudio",
      category: "Landing page · Identidad",
      description: "Una página de presentación serena que acerca nuevos visitantes a un espacio de bienestar.",
      detail: "La propuesta prioriza la información esencial, una identidad visual cercana y una invitación clara a reservar.",
      technologies: ["HTML", "CSS", "JavaScript"],
    },
    "sur-arquitectura": {
      name: "Sur Arquitectura",
      category: "Desarrollo web · Portfolio",
      description: "Un portfolio digital para presentar proyectos de arquitectura con claridad y carácter.",
      detail: "La estructura pone en primer plano el trabajo del estudio y facilita explorar sus proyectos desde cualquier dispositivo.",
      technologies: ["HTML", "CSS", "JavaScript"],
    },
    "arko-market": {
      name: "Arko Market",
      category: "E-commerce · Tienda online",
      description: "Una tienda online ágil para descubrir productos cotidianos con una experiencia de compra clara.",
      detail: "Diseñamos una navegación directa entre categorías y productos para que encontrar y elegir sea sencillo.",
      technologies: ["HTML", "CSS", "JavaScript"],
    },
  };

  const fields = {
    category: dialog.querySelector("#project-dialog-category"),
    title: dialog.querySelector("#project-dialog-title"),
    description: dialog.querySelector("#project-dialog-description"),
    detail: dialog.querySelector("#project-dialog-detail"),
    technologies: dialog.querySelector("#project-dialog-technologies"),
  };
  let lastTrigger = null;

  const closeDialog = () => {
    if (dialog.open) dialog.close();
  };

  openButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const project = projectDetails[button.dataset.project];
      if (!project) return;

      lastTrigger = button;
      fields.category.textContent = project.category;
      fields.title.textContent = project.name;
      fields.description.textContent = project.description;
      fields.detail.textContent = project.detail;
      fields.technologies.replaceChildren(
        ...project.technologies.map((technology) => {
          const item = document.createElement("li");
          item.textContent = technology;
          return item;
        })
      );

      dialog.showModal();
      closeButton.focus();
    });
  });

  closeButton.addEventListener("click", closeDialog);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });
  dialog.addEventListener("close", () => {
    if (lastTrigger?.isConnected) lastTrigger.focus();
    lastTrigger = null;
  });
};

const initFaqAccordion = () => {
  const questions = [...document.querySelectorAll(".faq-question[aria-controls]")];
  if (questions.length === 0) return;

  const setQuestionState = (question, isOpen) => {
    const panel = document.getElementById(question.getAttribute("aria-controls"));
    if (!panel) return;

    question.setAttribute("aria-expanded", String(isOpen));
    panel.classList.toggle("is-open", isOpen);
    panel.setAttribute("aria-hidden", String(!isOpen));
    panel.inert = !isOpen;
  };

  questions.forEach((question) => {
    setQuestionState(question, false);

    question.addEventListener("click", () => {
      const shouldOpen = question.getAttribute("aria-expanded") !== "true";
      questions.forEach((item) => setQuestionState(item, item === question && shouldOpen));
    });
  });
};

const initContactForm = () => {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  const status = form.querySelector(".form-status");
  const fields = {
    name: form.elements.namedItem("nombre"),
    email: form.elements.namedItem("email"),
    service: form.elements.namedItem("servicio"),
    message: form.elements.namedItem("mensaje"),
  };
  if (!status || Object.values(fields).some((field) => !field)) return;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const rules = [
    {
      field: fields.name,
      error: document.querySelector("#contact-name-error"),
      validate: () => fields.name.value.trim() ? "" : "Ingresá tu nombre.",
    },
    {
      field: fields.email,
      error: document.querySelector("#contact-email-error"),
      validate: () => {
        const value = fields.email.value.trim();
        if (!value) return "Ingresá tu email.";
        return emailPattern.test(value) ? "" : "Ingresá un email válido.";
      },
    },
    {
      field: fields.service,
      error: document.querySelector("#contact-service-error"),
      validate: () => ["web", "landing", "ecommerce", "maintenance"].includes(fields.service.value)
        ? ""
        : "Seleccioná un servicio.",
    },
    {
      field: fields.message,
      error: document.querySelector("#contact-message-error"),
      validate: () => {
        const value = fields.message.value.trim();
        if (!value) return "Contanos brevemente sobre tu proyecto.";
        return value.length >= 20 ? "" : "El mensaje debe tener al menos 20 caracteres.";
      },
    },
  ];
  if (rules.some((rule) => !rule.error)) return;

  const setFieldError = (rule, message) => {
    rule.field.setAttribute("aria-invalid", String(Boolean(message)));
    rule.error.textContent = message;
    rule.error.hidden = !message;
  };

  const setStatus = (message, state = "") => {
    status.textContent = message;
    if (state) status.dataset.state = state;
    else delete status.dataset.state;
  };

  rules.forEach((rule) => {
    const eventName = rule.field.tagName === "SELECT" ? "change" : "input";
    rule.field.addEventListener(eventName, () => {
      if (rule.field.getAttribute("aria-invalid") === "true") {
        setFieldError(rule, rule.validate());
      }

      if (status.dataset.state === "success") {
        setStatus();
      } else if (
        status.dataset.state === "error" &&
        !rules.some((item) => item.field.getAttribute("aria-invalid") === "true")
      ) {
        setStatus();
      }
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const results = rules.map((rule) => ({ rule, message: rule.validate() }));
    results.forEach(({ rule, message }) => setFieldError(rule, message));

    const firstInvalid = results.find(({ message }) => message);
    if (firstInvalid) {
      setStatus("Revisá los campos señalados antes de continuar.", "error");
      firstInvalid.rule.field.focus();
      return;
    }

    setStatus(
      "¡Gracias! Tu consulta quedó lista en esta demostración. No se envió a ningún servidor.",
      "success"
    );
  });

  form.addEventListener("reset", () => {
    window.setTimeout(() => {
      rules.forEach((rule) => setFieldError(rule, ""));
      setStatus();
    });
  });
};

const initScrollReveal = () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduceMotion.matches || !("IntersectionObserver" in window)) return;

  const revealTargets = [
    ...document.querySelectorAll(
      ".section-heading, .service-card, .project-card, .about-grid > *, .process-step, .faq-item, .final-cta-inner, .section-contact .contact-grid > *"
    ),
  ];
  const heroTargets = [
    ...document.querySelectorAll(
      ".hero-copy > .eyebrow, .hero-copy > h1, .hero-lede, .hero-actions, .hero-note, .hero-art"
    ),
  ];
  if (revealTargets.length === 0 && heroTargets.length === 0) return;

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );

  revealTargets.forEach((target) => {
    target.classList.add("reveal-on-scroll");
    observer.observe(target);
  });
  document.documentElement.classList.add("has-scroll-reveal");

  heroTargets.forEach((target, index) => {
    target.classList.add("hero-intro-item");
    target.style.setProperty("--hero-intro-delay", `${Math.min(index, 4) * 55}ms`);
  });
  if (heroTargets.length > 0) document.documentElement.classList.add("has-hero-motion");
};

const init = () => {
  initMobileMenu();
  initHeaderState();
  initBackToTop();
  initActiveNavigation();
  initProjectFilters();
  initProjectDialog();
  initFaqAccordion();
  initContactForm();
  initScrollReveal();
};

init();
