import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { Project } from '@/lib/portfolio-data';

const dataPath = path.join(process.cwd(), 'data', 'projects.json');

async function getProjects(): Promise<Project[]> {
  try {
    if (!existsSync(dataPath)) {
      return [];
    }
    const data = await readFile(dataPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading projects:', error);
    return [];
  }
}

async function saveProjects(projects: Project[]): Promise<void> {
  const dir = path.dirname(dataPath);
  if (!existsSync(dir)) {
    await writeFile(dataPath, JSON.stringify(projects, null, 2));
  } else {
    await writeFile(dataPath, JSON.stringify(projects, null, 2));
  }
}

export async function GET() {
  try {
    const projects = await getProjects();
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const project: Project = await request.json();
    const projects = await getProjects();
    
    // Generate ID if not provided
    if (!project.id) {
      project.id = `project-${Date.now()}`;
    }
    
    projects.push(project);
    await saveProjects(projects);

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updatedProject: Project = await request.json();
    const projects = await getProjects();
    
    const index = projects.findIndex(p => p.id === updatedProject.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    projects[index] = updatedProject;
    await saveProjects(projects);

    return NextResponse.json({ success: true, project: updatedProject });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    const projects = await getProjects();
    const filtered = projects.filter(p => p.id !== id);
    
    if (filtered.length === projects.length) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    await saveProjects(filtered);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
