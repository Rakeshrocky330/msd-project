# Project Restructuring Guide

## What Changed

### Before
\`\`\`
project/
├── server/                 # Backend code
├── client/                 # Frontend code
├── app/                    # Next.js (duplicate/unused)
├── lib/                    # Scattered utilities
├── models/                 # Scattered models
└── components/             # Next.js specific
\`\`\`

### After
\`\`\`
project/
├── backend/                # All backend code
│   └── src/               # Organized by layer
├── frontend/              # All frontend code
│   └── src/               # Organized by feature
└── docs/                  # Documentation
\`\`\`

## Benefits
1. Clear separation of concerns
2. Easier to maintain and scale
3. Clear entry points for each tier
4. Better for team collaboration
5. Easier CI/CD setup
6. Clear deployment strategy

## Migration Path

### Phase 1: Reorganize Backend
1. Create `backend/src/` structure
2. Move all server routes to `backend/src/routes/`
3. Move all models to `backend/src/models/`
4. Move middleware to `backend/src/middleware/`
5. Move controllers to `backend/src/controllers/`
6. Move utilities to `backend/src/utils/`

### Phase 2: Reorganize Frontend
1. Ensure all React components are in `frontend/src/`
2. Move pages to `frontend/src/pages/`
3. Move components to `frontend/src/components/`
4. Ensure styles are organized
5. Verify API service layer

### Phase 3: Cleanup
1. Archive or remove `app/` (Next.js structure)
2. Remove duplicate `lib/` files
3. Remove duplicate `models/` files
4. Update all imports
5. Test entire application

## Next Steps
1. Run the setup for new structure
2. Update import paths throughout
3. Test both backend and frontend
4. Deploy with new structure
5. Document any API changes
