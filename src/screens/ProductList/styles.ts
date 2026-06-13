// Purpose: Styling definition for the ProductListScreen.
import { StyleSheet } from 'react-native';
import {
  PRIMARY,
  BACKGROUND,
  CARD_BG,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  BORDER
} from '../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100, // Make room for the floating FAB
  },
  headerSection: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: TEXT_PRIMARY,
  },
  subtitle: {
    fontSize: 15,
    color: TEXT_SECONDARY,
    marginTop: 4,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: TEXT_SECONDARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    fontWeight: '500',
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  filterPill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterPillSelected: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  filterPillUnselected: {
    backgroundColor: CARD_BG,
    borderColor: BORDER,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterTextSelected: {
    color: CARD_BG,
  },
  filterTextUnselected: {
    color: TEXT_PRIMARY,
  },
  statusBorder: {
    borderLeftWidth: 4,
  },
  productCard: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
    shadowColor: TEXT_SECONDARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    flex: 1,
    marginRight: 8,
  },
  statusTag: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  skuText: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    marginTop: 2,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 14,
    color: TEXT_SECONDARY,
  },
  quantityNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT_PRIMARY,
  },
  categoryBadge: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: BACKGROUND,
  },
  categoryText: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: PRIMARY,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  fabIcon: {
    color: CARD_BG,
    fontSize: 28,
    fontWeight: '400',
    marginTop: -2,
  },
});
