const SUPABASE_URL = 'https://dsmrdpwccbmezzpgwcef.supabase.co';
const SUPABASE_KEY = 'sb_publishable_NprxXQvjDX-AEy64Q97hwg_AOL0ZOR4';

// MENU MOBILE
const menuBtn = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => nav.classList.toggle('open'));

  document.querySelectorAll('.nav a').forEach(a => {
    a.addEventListener('click', () => nav.classList.remove('open'));
  });
}

// ========================================
// MATRÍCULA / CADASTRO DO ALUNO
// ========================================

const enrollmentForm = document.getElementById('enrollmentForm');

if (enrollmentForm) {
  enrollmentForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const message = document.getElementById('enrollmentMessage');

    const nome = this.nome.value.trim();
    const email = this.email.value.trim();
    const whatsapp = this.whatsapp.value.trim();
    const nascimento = this.nascimento.value;
    const cidade = this.cidade.value.trim();

    message.textContent = 'Criando seu cadastro...';

    try {
      const senhaTemporaria = Math.random().toString(36).slice(-8) + 'Aa1!';

      const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY
        },
        body: JSON.stringify({
          email: email,
          password: senhaTemporaria,
          data: {
            full_name: nome,
            phone: whatsapp,
            birth_date: nascimento,
            city: cidade
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || data.message || 'Não foi possível realizar o cadastro.');
      }

      if (data.access_token && data.user) {
        await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${data.user.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${data.access_token}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            full_name: nome,
            phone: whatsapp
          })
        });

        localStorage.setItem('vetrium_access_token', data.access_token);
        localStorage.setItem('vetrium_user_email', email);
      }

      message.innerHTML =
        `✅ Cadastro realizado com sucesso.<br><br>
        <strong>E-mail:</strong> ${email}<br>
        <strong>Senha temporária:</strong> ${senhaTemporaria}<br><br>
        Guarde essa senha para acessar a Área do Aluno.`;

      message.style.color = '#183d2f';

      this.reset();

    } catch (error) {
      message.textContent = '❌ ' + error.message;
      message.style.color = '#8b3a2e';
    }
  });
}


// ========================================
// VALIDAÇÃO REAL DE CERTIFICADO
// ========================================

const validationForm = document.getElementById('validationForm');

if (validationForm) {
  validationForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const code = document
      .getElementById('certificateCode')
      .value
      .trim()
      .toUpperCase();

    const result = document.getElementById('validationResult');

    result.textContent = 'Verificando certificado...';

    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/rpc/validate_certificate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY
          },
          body: JSON.stringify({
            code_input: code
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error('Erro ao consultar o certificado.');
      }

      if (!data || data.length === 0) {
        result.textContent = '❌ Certificado não localizado.';
        result.style.color = '#8b3a2e';
        return;
      }

      const cert = data[0];

      if (cert.status !== 'valid') {
        result.textContent = '⚠️ Este certificado foi revogado.';
        result.style.color = '#8b3a2e';
        return;
      }

      const dataEmissao = new Date(cert.issued_at).toLocaleDateString('pt-BR');

      result.innerHTML =
        `✅ <strong>CERTIFICADO AUTÊNTICO</strong><br>
        Aluno: ${cert.student_name}<br>
        Curso: ${cert.course_name}<br>
        Emissão: ${dataEmissao}<br>
        Código: ${cert.certificate_code}`;

      result.style.color = '#183d2f';

    } catch (error) {
      result.textContent = '❌ ' + error.message;
      result.style.color = '#8b3a2e';
    }
  });
}
// ========================================
// LOGIN DA ÁREA DO ALUNO
// ========================================

const loginForm = document.getElementById('loginForm');

if (loginForm) {
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const message = document.getElementById('loginMessage');

    message.textContent = 'Entrando...';

    try {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error_description || data.msg || 'E-mail ou senha inválidos.');
      }

      localStorage.setItem('vetrium_access_token', data.access_token);
      localStorage.setItem('vetrium_refresh_token', data.refresh_token);
      localStorage.setItem('vetrium_user_id', data.user.id);
      localStorage.setItem('vetrium_user_email', data.user.email);

      message.textContent = '✅ Login realizado com sucesso.';
      message.style.color = '#183d2f';

      setTimeout(() => {
        window.location.href = 'aluno.html';
      }, 700);

    } catch (error) {
      message.textContent = '❌ ' + error.message;
      message.style.color = '#8b3a2e';
    }
  });
}
