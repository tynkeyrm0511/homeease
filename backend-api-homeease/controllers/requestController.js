const prisma = require('../prismaClient');
const { requestSchema } = require('../utils/validators');

// Get all requests - GET
async function getRequests(req, res) {
  try {
    const { userId: queryUserId } = req.query;

    // Determine a valid numeric userId to scope by. Avoid passing NaN/undefined to Prisma.
    const paramUserId = (queryUserId !== undefined && queryUserId !== null) ? Number(queryUserId) : undefined;
    const tokenUserId = (req.user && req.user.id !== undefined && req.user.id !== null) ? Number(req.user.id) : undefined;

    let where = undefined;
    if (tokenUserId && req.user?.role !== 'admin') {
      where = { userId: tokenUserId };
    } else if (Number.isFinite(paramUserId)) {
      where = { userId: paramUserId };
    }

    const findArgs = {
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    };
    if (where) findArgs.where = where;

    const requests = await prisma.request.findMany(findArgs);
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
}

// Get request detail - GET
async function getRequestDetail(req, res) {
  try {
    const { id } = req.params;
    const request = await prisma.request.findUnique({ where: { id: Number(id) }, include: { user: true } });
    if (!request) return res.status(404).json({ error: 'Request not found' });
    res.json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch request detail' });
  }
}

// Add a new request - POST
async function addRequest(req, res) {
  try {
    // Log incoming body for debugging when client reports 400
    console.log('addRequest - req.user:', req.user);
    console.log('addRequest - req.body:', req.body);

    const { error, value } = requestSchema.validate(req.body);
    if (error) {
      console.warn('addRequest validation failed:', error.details.map(d => d.message));
      return res.status(400).json({ error: error.details[0].message });
    }

    const { description, status, category, priority, userId: bodyUserId } = value;

    // Prefer authenticated user ID from token. Fallback to provided userId if present (admin creating on behalf).
    const creatorId = req.user && req.user.id ? Number(req.user.id) : bodyUserId ? Number(bodyUserId) : undefined;
    if (!creatorId) {
      console.warn('addRequest missing creatorId - token/userId not provided');
      return res.status(400).json({ error: 'userId is required' });
    }

    const newRequest = await prisma.request.create({
      data: {
        description,
        status: status || 'pending',
        category,
        priority: priority || 'medium',
        userId: creatorId,
      },
    });

    res.json(newRequest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create request' });
  }
}

// Update request - PUT
async function updateRequest(req, res) {
  try {
    const { id } = req.params;
    const { description, status, category, priority, userId } = req.body;
    console.log('updateRequest - req.user:', req.user);
    console.log('updateRequest - id:', id, 'body:', req.body);
    const updatedRequest = await prisma.request.update({
      where: { id: Number(id) },
      data: { description, status, category, priority, userId: userId ? Number(userId) : undefined },
    });
    res.status(201).json({ updatedRequest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update request' });
  }
}

// Delete request - DELETE
async function deleteRequest(req, res) {
  try {
    const { id } = req.params;
    await prisma.request.delete({ where: { id: Number(id) } });
    res.json({ message: 'Request deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete request' });
  }
}

module.exports = { getRequests, getRequestDetail, addRequest, updateRequest, deleteRequest };
// Cancel request (owner or admin) - sets status to 'cancelled'
async function cancelRequest(req, res) {
  try {
    const { id } = req.params;
    const updated = await prisma.request.update({ where: { id: Number(id) }, data: { status: 'cancelled' } });
    res.json(updated);
  } catch (err) {
    console.error('cancelRequest error', err);
    res.status(500).json({ error: 'Failed to cancel request' });
  }
}

module.exports = { getRequests, getRequestDetail, addRequest, updateRequest, deleteRequest, cancelRequest };