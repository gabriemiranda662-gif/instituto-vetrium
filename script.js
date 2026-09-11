
const menuBtn = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
menuBtn.addEventListener('click', () => nav.classList.toggle('open'));
document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

document.getElementById('validationForm').addEventListener('submit', function(e){
  e.preventDefault();
  const code = document.getElementById('certificateCode').value.trim().toUpperCase();
  const result = document.getElementById('validationResult');
  if(code === 'VETRIUM-2026-AUX-000001'){
    result.textContent = '✓ CERTIFICADO AUTÊNTICO — Curso de Auxiliar de Veterinário.';
    result.style.color = '#183d2f';
  } else {
    result.textContent = 'Código não localizado nesta versão demonstrativa.';
    result.style.color = '#8b3a2e';
  }
});

document.getElementById('enrollmentForm').addEventListener('submit', function(e){
  e.preventDefault();
  document.getElementById('enrollmentMessage').textContent = 'Pré-matrícula registrada nesta demonstração. A integração com banco de dados e pagamento será feita na próxima etapa.';
  this.reset();
});
