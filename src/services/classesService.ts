import { mockClasses } from "@/constants";
import type { ClassEntity } from "@/types";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const classesService = {
  async getByTeacher(teacherId: string): Promise<ClassEntity[]> {
    await delay(200);
    return mockClasses
      .filter((c) => c.teacherId === teacherId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async create(
    data: Omit<ClassEntity, "id" | "createdAt" | "updatedAt">
  ): Promise<ClassEntity> {
    await delay(250);
    const created: ClassEntity = {
      ...data,
      id: Math.random().toString(36).slice(2, 10),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockClasses.push(created);
    return created;
  },

  async update(id: string, updates: Partial<ClassEntity>): Promise<ClassEntity> {
    await delay(200);
    const i = mockClasses.findIndex((c) => c.id === id);
    if (i === -1) throw new Error("Class not found");
    mockClasses[i] = { ...mockClasses[i], ...updates, updatedAt: new Date() };
    return mockClasses[i];
  },

  async toggleActive(id: string): Promise<ClassEntity> {
    await delay(150);
    const i = mockClasses.findIndex((c) => c.id === id);
    if (i === -1) throw new Error("Class not found");
    mockClasses[i] = {
      ...mockClasses[i],
      active: !mockClasses[i].active,
      updatedAt: new Date(),
    };
    return mockClasses[i];
  },

  async delete(id: string): Promise<void> {
    await delay(150);
    const i = mockClasses.findIndex((c) => c.id === id);
    if (i !== -1) mockClasses.splice(i, 1);
  },
};
