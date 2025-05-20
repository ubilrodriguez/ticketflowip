import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Decorador para definir los roles requeridos para acceder a un recurso
 * @param roles Lista de roles que pueden acceder al recurso
 * @returns Decorador con los metadatos de roles
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);