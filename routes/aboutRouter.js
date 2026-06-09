import { Router } from 'express'
import footer from './footer.js';

const router = Router()

router.get('/', async (req, res, next) => {

    res.render('about', {
        footer: await footer()
    });
})

export default router;