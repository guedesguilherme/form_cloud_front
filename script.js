document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('alunoForm');
  const resultMessage = document.getElementById('resultMessage');

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Limpa mensagens anteriores
    clearErrors();
    hideResultMessage();

    // Validação dos campos
    if (!validateForm()) {
      return;
    }

    // Coleta os dados do formulário
    const alunoData = {
      nome_completo: document.getElementById('nome_completo').value.trim(),
      usuario_acesso: document.getElementById('usuario_acesso').value.trim(),
      senha: document.getElementById('senha').value,
      email_aluno: document.getElementById('email_aluno').value.trim(),
      observacao: document.getElementById('observacao').value.trim()
    };

    try {
      // Envia para a API
      const response = await fetch('http://localhost:3000/api/alunos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alunoData)
      });

      const data = await response.json();

      if (response.ok) {
        showResultMessage('Aluno cadastrado com sucesso!', 'success');
        form.reset();
      } else {
        showResultMessage(data.message || 'Erro ao cadastrar aluno', 'error');
        // Mostra erros específicos da API
        if (data.errors) {
          data.errors.forEach(error => {
            const field = error.path || '';
            const errorElement = document.getElementById(`${field}_error`);
            if (errorElement) {
              errorElement.textContent = error.msg;
              errorElement.style.display = 'block';
            }
          });
        }
      }
    } catch (error) {
      console.error('Erro:', error);
      showResultMessage('Erro na comunicação com o servidor', 'error');
    }
  });

  // Funções auxiliares
  function validateForm() {
    let isValid = true;
    const email = document.getElementById('email_aluno').value.trim();

    // Validação simples dos campos obrigatórios
    if (!document.getElementById('nome_completo').value.trim()) {
      showError('nome_error', 'Nome completo é obrigatório');
      isValid = false;
    }

    if (!document.getElementById('usuario_acesso').value.trim()) {
      showError('usuario_error', 'Usuário de acesso é obrigatório');
      isValid = false;
    }

    if (!document.getElementById('senha').value) {
      showError('senha_error', 'Senha é obrigatória');
      isValid = false;
    } else if (document.getElementById('senha').value.length < 6) {
      showError('senha_error', 'Senha deve ter no mínimo 6 caracteres');
      isValid = false;
    }

    if (!email) {
      showError('email_error', 'E-mail é obrigatório');
      isValid = false;
    } else if (!validateEmail(email)) {
      showError('email_error', 'Por favor, insira um e-mail válido');
      isValid = false;
    }

    return isValid;
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }

  function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(el => {
      el.textContent = '';
      el.style.display = 'none';
    });
  }

  function showResultMessage(message, type) {
    resultMessage.textContent = message;
    resultMessage.className = 'result-message ' + type;
    resultMessage.style.display = 'block';
  }

  function hideResultMessage() {
    resultMessage.style.display = 'none';
  }
});