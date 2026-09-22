const bcrypt = require('bcrypt');
const { sequelize, connectDB } = require('../database');
const Usuario = require('../src/models/Usuario');

async function seedUser() {
  const email = 'misa@gmail.com';
  const password = '123456789';
  const nombre = 'Misael';
  const rol = 'admin';

  try {
    await connectDB();
    await sequelize.sync({ alter: true }); 
    
    const hash = await bcrypt.hash(password, 10);
    
    const user = await Usuario.findOne({ where: { email } });
    
    if (user) {
      user.password_hash = hash;
      user.rol = rol;
      await user.save();
      console.log(`✅ Contraseña y rol actualizados para el usuario: ${email}`);
    } else {
      await Usuario.create({
        email,
        password_hash: hash,
        nombre_completo: nombre,
        rol
      });
      console.log(`✅ Usuario creado exitosamente: ${email}`);
    }
  } catch (error) {
    console.error('❌ Error procesando el usuario:', error);
  } finally {
    await sequelize.close();
    console.log('Conexión cerrada.');
  }
}

seedUser();
