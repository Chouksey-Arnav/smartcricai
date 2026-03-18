import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin only' }, { status: 403 });
    }

    const { routines } = await req.json();

    const results = [];
    for (const routine of routines) {
      const created = await base44.asServiceRole.entities.MentalRoutine.create(routine);
      results.push(created.id);
    }

    return Response.json({ success: true, created: results.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});