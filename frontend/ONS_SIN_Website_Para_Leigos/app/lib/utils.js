// DATABASE CONTROLLER - Funções para carregar notas MD
export const loadMarkdownNote = async (notePath) => {
  try {
    const response = await fetch(notePath)
    if (!response.ok) return null
    return await response.text()
  } catch (error) {
    console.error('Erro ao carregar nota:', error)
    return null
  }
}

// new fucntion for animations
export function animateOnScroll() {
  const elements = document.querySelectorAll('.animate-on-scroll')
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    })
  })

  elements.forEach(element => observer.observe(element))
}
