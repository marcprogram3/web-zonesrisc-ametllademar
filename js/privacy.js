// Tanca el banner i guarda la preferència
document.getElementById('acceptPrivacy').addEventListener('click', () => {
  document.getElementById('privacyBanner').style.display = 'none';
  localStorage.setItem('privacyAccepted', 'true');
});

// Mostra el banner només si no l'ha acceptat abans
if (!localStorage.getItem('privacyAccepted')) {
  document.getElementById('privacyBanner').style.display = 'block';
}