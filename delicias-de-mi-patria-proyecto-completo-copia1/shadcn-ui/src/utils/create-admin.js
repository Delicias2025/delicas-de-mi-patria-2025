// Simple script to create an admin user in localStorage

export function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    // Get existing users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Define admin user with explicit password
    const adminUser = {
      id: 'admin-' + Date.now().toString(),
      name: 'Administrador',
      email: 'admin@tienda.com',
      password: 'admin123',
      isAdmin: true
    };
    
    // Check if admin user already exists
    const existingAdmin = users.find(user => user.email === adminUser.email);
    
    if (existingAdmin) {
      console.log('Admin user already exists, updating password if needed');
      // Update password if it's different or missing
      if (existingAdmin.password !== adminUser.password) {
        existingAdmin.password = adminUser.password;
        existingAdmin.isAdmin = true; // Ensure admin flag is set
        
        // Save updated users list
        localStorage.setItem('users', JSON.stringify(users));
        console.log('Admin user credentials updated');
      }
      return true;
    }
    
    // If no existing admin, add new admin user
    users.push(adminUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    console.log('¡Usuario administrador creado con éxito!');
    console.log('Email: admin@tienda.com');
    console.log('Password: admin123');
    console.log('Ahora puedes acceder al panel de administración en /admin');
    
    return true;
  } catch (error) {
    console.error('Error creating admin user:', error);
    return false;
  }
}

// Make it available globally for execution in the browser console
if (typeof window !== 'undefined') {
  window.createAdminUser = createAdminUser;
}