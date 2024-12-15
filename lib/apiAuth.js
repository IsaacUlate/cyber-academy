import { authenticateUser, authorizeRoles } from '@/lib/auth';

// Middleware de verificación del JWT y autorización de roles
export async function verifyAuth(req, allowedRoles) {
  try {
    // Verificar si el usuario está autenticado
    const user = await authenticateUser(req);

    // Verificar si el usuario tiene uno de los roles permitidos
    authorizeRoles(allowedRoles)(user);

    // Retornar el usuario autenticado si la verificación es exitosa
    return { success: true, user };
  } catch (error) {
    // Si la verificación falla, devolver el error
    return { success: false, message: error.message };
  }
}
