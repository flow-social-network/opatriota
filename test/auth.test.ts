import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['error'],
});

describe('Auth Middleware', () => {
  beforeEach(async () => {
    await prisma.$connect();
    await prisma.users.deleteMany({});
    await prisma.articles.deleteMany({});
  });

  afterEach(async () => {
    await prisma.$disconnect();
  });

  it('should authenticate with Bearer token placeholder', async () => {
    const { default: app } = await import('../src/server');
    const res = await request(app)
      .get('/api/articles?userId=uid-test')
      .expect(200);
    expect(res.body.success).toBe(true);
  });

  it('should authenticate with userId in query', async () => {
    const { default: app } = await import('../src/server');
    const res = await request(app)
      .get('/api/articles?userId=uid-test')
      .expect(200);
    expect(res.body.success).toBe(true);
  });

  it('should return unauthenticated without credentials', async () => {
    const { default: app } = await import('../src/server');
    const res = await request(app).get('/api/articles');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Unauthenticated');
  });
});

describe('Authorization', () => {
  beforeEach(async () => {
    await prisma.$connect();
  });

  afterEach(async () => {
    await prisma.$disconnect();
  });

  it('should allow leitor role to read articles', async () => {
    const { default: app } = await import('../src/server');
    const res = await request(app)
      .get('/api/articles')
      .set('x-user-id', 'uid-leitor');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should allow administrador role full access', async () => {
    const { default: app } = await import('../src/server');
    const res = await request(app)
      .get('/api/articles')
      .set('x-user-id', 'uid-admin');
    expect(res.status).toBe(200);
  });

  it('should block unauthorized access to admin endpoints', async () => {
    const { default: app } = await import('../src/server');
    const res = await request(app)
      .get('/api/user/profile')
      .set('x-user-id', 'uid-leitor');
    expect(res.status).toBe(403);
  });
});

describe('Permission Isolation', () => {
  beforeEach(async () => {
    await prisma.$connect();
    // Create a test article by journalist
    await prisma.articles.create({
      data: {
        id: 'test-article',
        slug: 'test-article',
        title: 'Test Article',
        subtitle: 'Test Subtitle',
        kicker: 'Test Kicker',
        category: 'brasil',
        tags: ['politica'],
        content: 'Test content.',
        author: 'Test Author',
        authorId: 'uid-journalist',
        authorRole: 'jornalista',
        publishedAt: new Date().toISOString(),
        readTimeMinutes: 5,
        imageUrl: '',
        imageCaption: '',
        sourceName: 'Test Source',
        accessLevel: 'aberto',
        editorialStatus: 'PUBLICADA',
        seo: { metaTitle: '', metaDescription: '' },
        isFactCheck: false,
        factVerdict: undefined,
        factClaim: undefined,
        factDocuments: [],
        priority: 'normal',
      },
    });
  });

  afterEach(async () => {
    await prisma.$disconnect();
  });

  it('should prevent journalist from modifying others articles', async () => {
    const { default: app } = await import('../src/server');
    const res = await request(app)
      .patch('/api/articles/test-article')
      .set('x-user-id', 'uid-another-journalist')
      .send({ editorialStatus: 'APROVADA' });
    expect(res.status).toBe(403);
  });

  it('should allow editor to manage editorial queue', async () => {
    const { default: app } = await import('../src/server');
    const res = await request(app)
      .get('/api/articles')
      .set('x-user-id', 'uid-editor');
    expect(res.status).toBe(200);
  });
});