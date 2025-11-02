const { UserService } = require('../src/userService');

describe('UserService - Suíte de Testes Limpos', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    userService._clearDB();
  });

  describe('createUser', () => {
    test('deve criar um usuário com dados válidos', () => {
      const nome = 'Fulano de Tal';
      const email = 'fulano@teste.com';
      const idade = 25;

      const usuarioCriado = userService.createUser(nome, email, idade);


      expect(usuarioCriado).toBeDefined();
      expect(usuarioCriado.id).toBeDefined();
      expect(usuarioCriado.nome).toBe(nome);
      expect(usuarioCriado.email).toBe(email);
      expect(usuarioCriado.idade).toBe(idade);
      expect(usuarioCriado.status).toBe('ativo');
      expect(usuarioCriado.isAdmin).toBe(false);
    });

    test('deve criar um usuário administrador quando especificado', () => {
      const nome = 'Admin User';
      const email = 'admin@teste.com';
      const idade = 30;
      const isAdmin = true;

      const usuarioAdmin = userService.createUser(nome, email, idade, isAdmin);


      expect(usuarioAdmin.isAdmin).toBe(true);
      expect(usuarioAdmin.status).toBe('ativo');
    });

    test('deve lançar erro ao tentar criar usuário menor de idade', () => {
      const nome = 'Menor de Idade';
      const email = 'menor@teste.com';
      const idadeMenor = 17;


      expect(() => {
        userService.createUser(nome, email, idadeMenor);
      }).toThrow('O usuário deve ser maior de idade.');
    });

    test('deve lançar erro ao criar usuário sem nome', () => {
      const email = 'teste@teste.com';
      const idade = 25;


      expect(() => {
        userService.createUser('', email, idade);
      }).toThrow('Nome, email e idade são obrigatórios.');
    });
  });

  describe('getUserById', () => {
    test('deve buscar um usuário existente pelo ID', () => {
      const usuarioCriado = userService.createUser('Fulano', 'fulano@teste.com', 25);
      const idEsperado = usuarioCriado.id;

      const usuarioBuscado = userService.getUserById(idEsperado);


      expect(usuarioBuscado).toBeDefined();
      expect(usuarioBuscado.id).toBe(idEsperado);
      expect(usuarioBuscado.nome).toBe('Fulano');
      expect(usuarioBuscado.email).toBe('fulano@teste.com');
    });

    test('deve retornar null ao buscar usuário inexistente', () => {
      const idInexistente = 'id-que-nao-existe';

      const resultado = userService.getUserById(idInexistente);


      expect(resultado).toBeNull();
    });
  });

  describe('deactivateUser', () => {
    test('deve desativar um usuário comum com sucesso', () => {
      const usuarioComum = userService.createUser('Comum', 'comum@teste.com', 30);
      const idUsuarioComum = usuarioComum.id;

      const resultado = userService.deactivateUser(idUsuarioComum);


      expect(resultado).toBe(true);
      const usuarioAtualizado = userService.getUserById(idUsuarioComum);
      expect(usuarioAtualizado.status).toBe('inativo');
    });

    test('não deve desativar um usuário administrador', () => {
      const usuarioAdmin = userService.createUser('Admin', 'admin@teste.com', 40, true);
      const idAdmin = usuarioAdmin.id;

      const resultado = userService.deactivateUser(idAdmin);


      expect(resultado).toBe(false);
      const usuarioVerificado = userService.getUserById(idAdmin);
      expect(usuarioVerificado.status).toBe('ativo');
    });

    test('deve retornar false ao tentar desativar usuário inexistente', () => {
      const idInexistente = 'id-invalido';

      const resultado = userService.deactivateUser(idInexistente);


      expect(resultado).toBe(false);
    });
  });

  describe('generateUserReport', () => {
    test('deve gerar relatório quando não há usuários cadastrados', () => {
      const relatorio = userService.generateUserReport();


      expect(relatorio).toContain('--- Relatório de Usuários ---');
      expect(relatorio).toContain('Nenhum usuário cadastrado.');
    });

    test('deve gerar relatório com um usuário cadastrado', () => {
      const usuario = userService.createUser('Alice', 'alice@email.com', 28);

      const relatorio = userService.generateUserReport();


      expect(relatorio).toContain('--- Relatório de Usuários ---');
      expect(relatorio).toContain('Alice');
      expect(relatorio).toContain(usuario.id);
      expect(relatorio).toContain('ativo');
    });

    test('deve gerar relatório com múltiplos usuários', () => {
      const alice = userService.createUser('Alice', 'alice@email.com', 28);
      const bob = userService.createUser('Bob', 'bob@email.com', 32);

      const relatorio = userService.generateUserReport();


      expect(relatorio).toContain('--- Relatório de Usuários ---');
      expect(relatorio).toContain('Alice');
      expect(relatorio).toContain('Bob');
      expect(relatorio).toContain(alice.id);
      expect(relatorio).toContain(bob.id);
    });

    test('deve incluir usuários inativos no relatório', () => {
      const usuario = userService.createUser('Carlos', 'carlos@email.com', 30);
      userService.deactivateUser(usuario.id);

      const relatorio = userService.generateUserReport();


      expect(relatorio).toContain('Carlos');
      expect(relatorio).toContain('inativo');
    });
  });
});
